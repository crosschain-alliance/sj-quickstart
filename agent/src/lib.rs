#![no_std]

use alloy_primitives::{Address, Bloom, Bytes, B256, U256, U64};
use alloy_rlp::{Decodable, RlpDecodable};
use t_rust::{commit_slice, read_vec};

#[derive(RlpDecodable)]
struct BlockHeader {
    parent_hash: B256,
    uncle_hash: B256,
    coinbase: Address,
    state_root: B256,
    transactions_root: B256,
    receipts_root: B256,
    logs_bloom: Bloom,
    difficulty: U256,
    number: U256,
    gas_limit: U64,
    gas_used: U64,
    timestamp: U64,
    extra_data: Bytes,
    mix_hash: B256,
    nonce: Bytes,
    base_fee_per_gas: U256,
    withdrawals_root: B256,
    blob_gas_used: U64,
    excess_blob_gas: U64,
    parent_beacon_block_root: B256,
}

pub fn main() {
    let block_header_rlp = read_vec();
    let block_header =
        BlockHeader::decode(&mut Bytes::from(block_header_rlp).to_vec().as_slice()).unwrap();
    commit_slice(block_header.base_fee_per_gas.to_be_bytes_vec().as_slice());
}
