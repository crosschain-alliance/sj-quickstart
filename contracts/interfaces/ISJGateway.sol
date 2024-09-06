// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

struct Leaf {
    bytes32 key;
    bytes32 valueHash;
}

struct JellyfishMerkleProof {
    Leaf leaf;
    bytes32[] siblings;
}

interface ISJGateway {
    struct ValueReference {
        uint32 nonce;
        bytes32 rootHash;
        bytes32 key;
        bytes value;
        JellyfishMerkleProof proof;
    }

    function executeAgent(
        bytes[] calldata inputs,
        bytes32[] calldata keys,
        string memory ref
    ) external returns (bytes32);

    function readAgentOutputs(ValueReference calldata valueReference) external view returns (bytes[] memory);
}
