use base64::Engine;
use base64::prelude::BASE64_STANDARD;
#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{Addr, attr, Binary, CosmosMsg, Deps, DepsMut, Empty, ensure, Env, MessageInfo, Order, StdError, StdResult, Storage, to_json_binary};
use cosmwasm_std::Order::Ascending;
use cw2::{ContractVersion, get_contract_version, set_contract_version};
use cyber_std::{create_cyberlink_msg, CyberMsgWrapper, Link};
use cyber_std::particle::prepare_particle;
use sha2::{Digest, Sha256};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, Payload, Post, QueryMsg, State};
use crate::state::{CONFIG, Config, NICKNAMES, POSTS};
use crate::ton::{CheckProofPayload, TonAddress};

type Response = cosmwasm_std::Response<CyberMsgWrapper>;
const CONTRACT_NAME: &str = "crates.io:contract";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

pub fn ensure_root(store: &dyn Storage, address: &Addr) -> Result<(), ContractError> {
    let config = CONFIG.load(store)?;
    ensure!(config.admin == address, ContractError::Unauthorized {});
    Ok(())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    CONFIG.save(deps.storage, &Config{ admin: info.sender })?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::RelayTonMsg { pubkey, proof } => do_relay_ton_msg(deps, env, info, pubkey, proof),
        ExecuteMsg::UpdateAdmin { admin } => do_update_admin(deps, env, info, admin),
        ExecuteMsg::DebugExecute { msgs } => do_debug_execute(deps, env, info, msgs),
    }
}

pub fn do_relay_ton_msg(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    pubkey: String,
    proof_payload: CheckProofPayload,
) -> Result<Response, ContractError> {
    // TODO enable later
    // ensure_root(deps.storage, &info.sender)?;

    ensure!(
        check_proof(deps.as_ref(), pubkey.clone(), proof_payload.clone())? == true,
        ContractError::Unauthorized {}
    );

    let payload: Payload = serde_json::from_str(&proof_payload.proof.payload)
        .map_err(|_| ContractError::PayloadError {})?;

    if payload.msg_type == "map_nickname" {
        NICKNAMES.save(deps.storage, pubkey.clone(), &payload.msg_data)?;
    }

    if payload.msg_type == "add_post" {
        ensure!(
            NICKNAMES.has(deps.storage, pubkey.clone()),
            ContractError::Unauthorized {}
        );
        POSTS.save(deps.storage, (pubkey.clone(), env.block.time.seconds()), &payload.msg_data)?;
        let link = Link {
                from: prepare_particle(pubkey)?.to_string(),
                to: prepare_particle(payload.msg_data)?.to_string(),
            };
        let msg = create_cyberlink_msg(env.contract.address.to_string(), vec![link]);
        return Ok(Response::new()
            .add_attribute("action", "relay_msg")
            .add_message(msg)
        )
    }

    Ok(Response::new()
        .add_attributes(vec![
            attr("action", "relay_msg"),
            // attr("result", rst.to_string()),
    ]))
}

pub fn do_update_admin(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    admin: String,
) -> Result<Response, ContractError> {
    ensure_root(deps.storage, &info.sender)?;

    CONFIG.save(deps.storage, &Config{ admin: deps.api.addr_validate(&admin)?})?;

    Ok(Response::new()
        .add_attribute("action", "update_admin")
    )
}

pub fn do_debug_execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msgs: Vec<CosmosMsg<CyberMsgWrapper>>,
) -> Result<Response, ContractError> {
    ensure_root(deps.storage, &info.sender)?;

    Ok(Response::new()
        .add_messages(msgs)
        .add_attribute("action", "execute")
    )
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(
    deps: Deps,
    _env: Env,
    msg: QueryMsg
) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config { } => to_json_binary(&get_config(deps.storage)?),
        QueryMsg::GetNickname { pubkey } => to_json_binary(&get_nickname(deps.storage, pubkey)?),
        QueryMsg::GetPosts { pubkey } => to_json_binary(&get_posts(deps.storage, pubkey)?),
        QueryMsg::CheckProof { pubkey, proof } => to_json_binary(&check_proof(deps, pubkey, proof)?),
        QueryMsg::GetDebugState { } => to_json_binary(&get_debug_state(deps.storage)?),
    }
}

pub fn get_config(store: &dyn Storage) -> StdResult<Config> {
    let config = CONFIG.load(store)?;

    return Ok(config)
}

pub fn get_nickname(store: &dyn Storage, pubkey: String) -> StdResult<String> {
    let nickname = NICKNAMES.load(store, pubkey)?;

    return Ok(nickname)
}

pub fn check_proof(
    deps: Deps,
    pubkey: String,
    proof_payload: CheckProofPayload
) -> StdResult<bool> {
    const TON_PROOF_PREFIX: &'static str = "ton-proof-item-v2/";

    let ton_address = TonAddress::from_hex_str(&proof_payload.address)
        .map_err(|err| StdError::generic_err(err.to_string()))?;

    let mut msg: Vec<u8> = Vec::new();
    msg.extend_from_slice(TON_PROOF_PREFIX.as_bytes());
    msg.extend_from_slice(&ton_address.workchain.to_be_bytes());
    msg.extend_from_slice(&ton_address.hash_part); // should it be big endian?
    msg.extend_from_slice(&(proof_payload.proof.domain.length_bytes as u32).to_le_bytes());
    msg.extend_from_slice(proof_payload.proof.domain.value.as_bytes());
    msg.extend_from_slice(&proof_payload.proof.timestamp.to_le_bytes());
    msg.extend_from_slice(proof_payload.proof.payload.as_bytes());

    let mut hasher = Sha256::new();
    hasher.update(msg);
    let msg_hash = hasher.finalize();

    const TON_CONNECT_PREFIX: &'static str = "ton-connect";

    let mut full_msg: Vec<u8> = vec![0xff, 0xff];
    full_msg.extend_from_slice(TON_CONNECT_PREFIX.as_bytes());
    full_msg.extend_from_slice(&msg_hash);

    let mut hasher = Sha256::new();
    hasher.update(full_msg);
    let full_msg_hash = hasher.finalize();


    // let pubkey = VerifyingKey::from_bytes(&pubkey_bytes)?;
    let signature_bytes: [u8; 64] = BASE64_STANDARD
        .decode(&proof_payload.proof.signature)
        // .map_err(|e| ContractError::VerificationFailed { msg: "sig bytes error".to_string() })?
        .map_err(|err| StdError::generic_err(err.to_string()))?
        .try_into()
        // .map_err(|_| ContractError::VerificationFailed { msg: "expected 64 bit long signature".to_string() })?;
        .map_err(|_| StdError::generic_err("expected 64 bit long signature".to_string()))?;
    // let signature = Signature::from_bytes(&signature_bytes);
    // pubkey
    //     .verify(&full_msg_hash, &signature)
    //     .map_err(|e| AppError::BadRequest(e.into()))?;


    // let public_key_hex = "db642e022c80911fe61f19eb4f22d7fb95c1ea0b589c0f74ecf0cbf6db746c13".as_bytes();
    let public_key_hex = pubkey.as_bytes();

    let binding = hex::decode(public_key_hex).unwrap();
    let public_key = binding.as_slice();

    let result = deps
        .api
        .ed25519_verify(
            full_msg_hash.as_slice(),
            &signature_bytes.as_slice(),
            public_key,
        )
        // .map_err(|err| ContractError::VerificationFailed {
        //     msg: err.to_string(),
        // });
        .map_err(|err| StdError::generic_err(err.to_string()))?;


    Ok(result)
}

pub fn get_posts(store: &dyn Storage, pubkey: String) -> StdResult<Vec<Post>> {
    let posts = POSTS
        .prefix(pubkey)
        .range(store, None, None, Order::Ascending)
        .map(|post| {
            let p: (u64, String) = post.unwrap();
            Post{post: p.1, timestamp: p.0}
        })
        .collect::<Vec<Post>>();

    return Ok(posts)
}

pub fn get_debug_state(store: &dyn Storage) -> StdResult<State> {
    let nicknames = NICKNAMES
        .range(store, None, None, Ascending)
        .collect::<StdResult<Vec<(String, String)>>>()
        .unwrap();
    let posts = POSTS
        .range(store, None, None, Ascending)
        .map(|item| {
            let ((addr,timestamp), post) = item.unwrap();
            (addr, Post{post,timestamp})
        })
        .collect::<Vec<(String, Post)>>();

    return Ok(State {
        nicknames,
        posts,
    })
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(
    _deps: DepsMut,
    _env: Env,
    _msg: Empty,
) -> Result<Response, ContractError> {
    // let storage_version: ContractVersion = get_contract_version(deps.storage)?;
    //
    // if storage_version.version.as_str() < CONTRACT_VERSION {
    //     set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    // } else {
    //     return Err(ContractError::MigrationError {})
    // }

    Ok(Response::new().add_attribute("action", "migrate"))
}

#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use crate::contract::{check_proof, instantiate, query};
    use crate::msg::InstantiateMsg;
    use crate::ton::{CheckProofPayload, TonDomain, TonNetwork, TonProof};

    #[test]
    fn test_proof() {
        let mut deps = mock_dependencies();

        let admin = "admin";
        let instantiate_msg = InstantiateMsg {};

        instantiate(
            deps.as_mut(),
            mock_env(),
            mock_info(&admin, &[]),
            instantiate_msg
        ).unwrap();

        let proof = CheckProofPayload {
            address: "0:f63660ff947e5fe6ed4a8f729f1b24ef859497d0483aaa9d9ae48414297c4e1b".to_string(),
            network: TonNetwork::Mainnet,
            proof: TonProof {
                domain: TonDomain {
                    length_bytes: 21,
                    value: "ton-connect.github.io".to_string()
                },
                payload: "E5B4ARS6CdOI2b5e1jz0jnS-x-a3DgfNXprrg_3pec0=".to_string(),
                signature: "28tWSg8RDB3P/iIYupySINq1o3F5xLodndzNFHOtdi16Z+MuII8LAPnHLT3E6WTB27//qY4psU5Rf5/aJaIIAA==".to_string(),
                state_init: "".to_string(),
                timestamp: 1668094767,
            },
        };

        let result = check_proof(
            deps.as_ref(),
            "db642e022c80911fe61f19eb4f22d7fb95c1ea0b589c0f74ecf0cbf6db746c13".to_string(),
            proof,
        );

        assert_eq!(result.is_ok(), true);
    }
}
