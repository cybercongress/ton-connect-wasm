use crate::ContractError;
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct TonAddress {
    pub workchain: i32,
    pub hash_part: [u8; 32],
}
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct CheckProofPayload {
    // pub address: TonAddress,
    pub address: String,
    pub network: TonNetwork,
    pub proof: TonProof,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum TonNetwork {
    #[serde(rename = "-239")]
    Mainnet,
    #[serde(rename = "-3")]
    Testnet,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct TonProof {
    pub domain: TonDomain,
    pub payload: String,
    pub signature: String,
    pub state_init: String,
    pub timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct TonDomain {
    #[serde(rename = "lengthBytes")]
    pub length_bytes: u64,
    pub value: String,
}

impl TonAddress {
    pub const NULL: TonAddress = TonAddress {
        workchain: 0,
        hash_part: [0; 32],
    };

    pub fn new(workchain: i32, hash_part: &[u8; 32]) -> TonAddress {
        TonAddress {
            workchain,
            hash_part: hash_part.clone(),
        }
    }

    pub fn null() -> TonAddress {
        TonAddress::NULL.clone()
    }

    pub fn from_hex_str(s: &str) -> Result<TonAddress, ContractError> {
        let parts: Vec<&str> = s.split(":").collect();

        if parts.len() != 2 {
            return Err(ContractError::TonAddressParseError{
                sender: s.to_string(),
                message: "Invalid hex address string: wrong address format".to_string(),
            });
        }

        let maybe_wc = i32::from_str_radix(parts[0], 10);
        let wc = match maybe_wc {
            Ok(wc) => wc,
            Err(_) => {
                return Err(ContractError::TonAddressParseError{
                    sender: s.to_string(),
                    message: "Invalid hex address string: parse int error".to_string(),
                })
            }
        };

        let maybe_decoded_hash_part = hex::decode(parts[1]);
        let decoded_hash_part = match maybe_decoded_hash_part {
            Ok(decoded_hash_part) => decoded_hash_part,
            Err(_) => {
                return Err(ContractError::TonAddressParseError{
                    sender: s.to_string(),
                    message: "Invalid hex address string: base64 decode error".to_string(),
                })
            }
        };

        let maybe_hash_part = decoded_hash_part.as_slice().try_into();
        let hash_part = match maybe_hash_part {
            Ok(hash_part) => hash_part,
            Err(_) => {
                return Err(ContractError::TonAddressParseError{
                    sender: s.to_string(),
                    message: "Invalid hex address string: unexpected error".to_string(),
                })
            }
        };

        let addr = TonAddress::new(wc, &hash_part);
        Ok(addr)
    }
}