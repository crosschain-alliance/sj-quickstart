import axios from "axios"
import { task } from "hardhat/config"
import type { TaskArguments } from "hardhat/types"
import { BaseFeePerGasOracle, SimpleGateway } from "../typechain-types"
import { BytesLike } from "ethers"

const AGENT_ID = "0x0000000001b8fa0698e7ea4dd89d27994be35a4ae086dbdd2377e1710f2b19c9"
const SJ_JSON_RPC_URL = "https://api-ea.safejunction.io/v1"

const sleep = (_ms: number) =>
  new Promise((_resolve) =>
    setTimeout(() => {
      _resolve(null)
    }, _ms),
  )

task("BaseFeePerGasOracle:deploy")
  .addParam("gateway", "SJGateway address")
  .setAction(async function (_args: TaskArguments, { ethers }) {
    console.log("Deploying BaseFeePerGasOracle ...")
    const BaseFeePerGasOracle = await ethers.getContractFactory("BaseFeePerGasOracle")
    const baseFeePerGasOracle = await BaseFeePerGasOracle.deploy(_args.gateway)
    await baseFeePerGasOracle.waitForDeployment()
    console.log("BaseFeePerGasOracle deployed at:", await baseFeePerGasOracle.getAddress())
  })

task("BaseFeePerGasOracle:execAndReadBaseFeePerGas")
  .addParam("oracle", "BaseFeePerGasOracle address")
  .addParam("gateway", "SJGateway address")
  .setAction(async function (_args: TaskArguments, { ethers }) {
    const {
      data: {
        result: { nonce },
      },
    } = await axios.post(SJ_JSON_RPC_URL, {
      jsonrpc: "2.0",
      id: 3,
      method: "sj_getStatus",
      params: {},
    })
    let lastNonce = nonce

    const SimpleGateway = await ethers.getContractFactory("SimpleGateway")
    const gateway = (await SimpleGateway.attach(_args.gateway)) as SimpleGateway

    const BaseFeePerGasOracle = await ethers.getContractFactory("BaseFeePerGasOracle")
    const baseFeePerGasOracle = (await BaseFeePerGasOracle.attach(_args.oracle)) as BaseFeePerGasOracle
    let tx = await baseFeePerGasOracle.exec()
    console.log("exec transaction sent:", tx.hash)

    let ref = null
    while (true) {
      const {
        data: { result },
      } = await axios.post(SJ_JSON_RPC_URL, {
        jsonrpc: "2.0",
        id: 3,
        method: "sj_getValueReference",
        params: {
          key: AGENT_ID,
          formats: ["evm"],
        },
      })
      if (result.nonce > lastNonce) {
        lastNonce = result.nonce
        ref = result.evm
        break
      }

      console.log("Agent not processed yet, waiting ...")
      await sleep(15 * 1000)
    }

    while (true) {
      const rootHash = await gateway.getRootHashByNonce(lastNonce)
      if (rootHash != "0x0000000000000000000000000000000000000000000000000000000000000000") {
        tx = await baseFeePerGasOracle.readBaseFeePerGas(ref)
        console.log("readBaseFeePerGas transaction sent:", tx.hash)
        console.log("Waiting for the receipt ...")
        const receipt = await tx.wait(1)
        const log = receipt?.logs.find(
          (_log) => _log.topics[0] === "0x7c014695e587a1f201e936abf4f7dba17bedd2bcc74501602d0695580b3dad2c",
        )
        console.log("baseFeePerGas:", ethers.toBigInt(ethers.stripZerosLeft(log?.data as BytesLike)))
        break
      }
      console.log("Waiting for the root hash update ...")
      await sleep(10 * 1000)
    }
  })
