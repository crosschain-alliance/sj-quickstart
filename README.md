# sj-quickstart

Welcome to the **sj-quickstart** repository! In this guide, we’ll walk you through creating a SafeJunction agent that
functions as an **Ethereum Gas Price Oracle**. The goal of this agent is to retrieve the `baseFeePerGas` value from the
latest Ethereum mainnet block and provide it to a Solidity contract deployed on the Sepolia testnet.

This is accomplished by leveraging the **SafeJunction platform**, which enables seamless data retrieval across different
environments by utilizing one agent's output as another's input.

---

👷 Looking to write your own custom agent? Check out the [tRust SDK](https://github.com/crosschain-alliance/t-rust).

🔗 Looking for the **SJ_GATEWAY_SEPOLIA** contract or the **tRust** repo? Join our [Early Access** programme](https://forms.gle/YKwv47pLjKe3iYbk6).

📚 [**Read the docs**](https://docs.safejunction.io)  
💬 [**Join our community**](https://docs.safejunction.io/meta/community)  
🛠️ [**Early Access**](https://forms.gle/YKwv47pLjKe3iYbk6)

---


## Getting Started

1. **Set Up Environment Variables**

   First, create an `.env` file in the root of the project with the following content. This will store the necessary
   keys for deployment and interaction with the Ethereum network:

   ```bash
   PRIVATE_KEY=
   ETHERSCAN_API_KEY=
   SEPOLIA_JSON_RPC_URL=
   ```

   - **PRIVATE_KEY**: Your wallet's private key.
   - **ETHERSCAN_API_KEY**: Your Etherscan API key (for contract verification and gas estimation).
   - **SEPOLIA_JSON_RPC_URL**: The JSON-RPC URL for the Sepolia testnet.

2. **Compile the Contracts**

   Once the environment variables are set, compile the Solidity contracts using Hardhat:

   ```bash
   npx hardhat compile
   ```

3. **Deploy the `BaseFeePerGasOracle` Contract**

   After compilation, you can deploy the `BaseFeePerGasOracle` contract to the Sepolia network using the following
   command:

   ```bash
   npx hardhat BaseFeePerGasOracle:deploy \
   --gateway <gateway-address> \
   --network sepolia
   ```

   - Replace `<gateway-address>` with the actual address of the gateway you'll be using.

4. **Execute and Read the Result**

   To execute the agent and retrieve the `baseFeePerGas` from the Ethereum mainnet, run the following command:

   ```bash
   npx hardhat BaseFeePerGasOracle:execAndReadBaseFeePerGas \
   --gateway <gateway-address> \
   --oracle <oracle-address> \
   --network sepolia
   ```

   - Replace `<gateway-address>` with the actual address of the gateway you'll be using.
   - Replace `<oracle-address>` with the actual deployed address of your `BaseFeePerGasOracle` contract.

---

## Example Output

When you run the `BaseFeePerGasOracle:execAndReadBaseFeePerGas` command, you might see output similar to the following:

```
exec transaction sent: 0x335ffaab8033ca9c343f22f36e1d869464f8fe541450cda85df77f9e941152a8
Agent not processed yet, waiting ...
Agent not processed yet, waiting ...
Agent not processed yet, waiting ...
Waiting for the root hash update ...
Waiting for the root hash update ...
Waiting for the root hash update ...
readBaseFeePerGas transaction sent: 0xd355e97d6bb33ea55930ce8385f217ba81341df0e7848951fd865084e409c1ff
Waiting for the receipt ...
baseFeePerGas: 2726551007n
```
