// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { ISJGateway } from "./interfaces/ISJGateway.sol";

contract BaseFeePerGasOracle {
    address public immutable SJ_GATEWAY;

    event BaseFeePerGas(uint256 value);

    constructor(address gateway) {
        SJ_GATEWAY = gateway;
    }

    function exec() external {
        bytes[] memory inputs = new bytes[](0);
        bytes32[] memory keys = new bytes32[](1);
        string memory ref = "ipfs://QmU5uFUVRQ5q3H6CW9Pyxhb4okSMc6uDW1GW5SHF4CsyLG";
        keys[0] = 0x00000000015438f3e66d20db0c133d079c29e43f3e7a3f8fd67d0822b5bda485;
        ISJGateway(SJ_GATEWAY).executeAgent(inputs, keys, ref);
    }

    function readBaseFeePerGas(ISJGateway.ValueReference calldata ref) external {
        bytes32 agentId = 0x0000000001b8fa0698e7ea4dd89d27994be35a4ae086dbdd2377e1710f2b19c9;
        require(ref.key == agentId, "Invalid key");
        bytes[] memory outputs = ISJGateway(SJ_GATEWAY).readAgentOutputs(ref);
        emit BaseFeePerGas(uint256(bytes32(outputs[0])));
    }
}
