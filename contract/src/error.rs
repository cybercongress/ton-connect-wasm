use cosmwasm_std::StdError;
use cyber_std::particle::ParticleError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Ton parse error: {sender}, {message}")]
    TonAddressParseError { sender: String, message: String },

    #[error("Verification failed")]
    VerificationFailed { msg: String },

    #[error("Contract have issue during migration")]
    MigrationError {},

    #[error("Payload type and data error")]
    PayloadError {},

    #[error("Invalid data for the particle")]
    InvalidParticleData {},

    #[error("Invalid particle")]
    InvalidParticle {},

    #[error("Invalid particle version")]
    InvalidParticleVersion {},
}

impl From<ParticleError> for ContractError {
    fn from(msg: ParticleError) -> ContractError {
        match msg {
            ParticleError::InvalidParticleData {} => ContractError::InvalidParticleData {},
            ParticleError::InvalidParticle {} => ContractError::InvalidParticle {},
            ParticleError::InvalidParticleVersion {} => ContractError::InvalidParticleVersion {}
        }
    }
}
