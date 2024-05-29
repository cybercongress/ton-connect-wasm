use crate::state::Config;
use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{CosmosMsg};
use cyber_std::CyberMsgWrapper;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use crate::ton::CheckProofPayload;

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub enum ExecuteMsg {
    RelayTonMsg {
        pubkey: String,
        proof: CheckProofPayload,
    },
    UpdateAdmin {
        admin: String,
    },
    DebugExecute {
        msgs: Vec<CosmosMsg<CyberMsgWrapper>>,
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(Config)]
    Config {},
    #[returns(String)]
    GetNickname { pubkey: String },
    #[returns(Vec<Post>)]
    GetPosts { pubkey: String },
    #[returns(bool)]
    CheckProof {
        pubkey: String,
        proof: CheckProofPayload,
    },
    #[returns(State)]
    GetDebugState {},
}

#[cw_serde]
pub struct MigrateMsg {}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Payload {
    pub msg_type: String,
    pub msg_data: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Post {
    pub post: String,
    // pub particle: String,
    pub timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub nicknames: Vec<(String, String)>,
    pub posts: Vec<(String, Post)>,
}
