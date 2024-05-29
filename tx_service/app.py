import logging
import sys

from cosmpy.aerial.client import NetworkConfig, Address
from cosmpy.aerial.wallet import LocalWallet
from dotenv import dotenv_values
from flask import Flask, request, jsonify

from contract_execution import execute_contract

WALLET_SEED = dotenv_values(".env")['WALLET_SEED']
CONTRACT_ADDRESS = dotenv_values(".env")['CONTRACT_ADDRESS']
CHAIN_ID = 'space-pussy'
PREFIX = 'pussy'
NODE_LCD_URL = 'https://lcd.space-pussy.cybernode.ai'
ACCOUNT = 0

app = Flask(__name__)

NETWORK_CONFIG = NetworkConfig(
    chain_id=CHAIN_ID,
    fee_minimum_gas_price=0,
    fee_denomination='pussy',
    staking_denomination='pussy',
    url="grpc+https://grpc.space-pussy.cybernode.ai:1443"
)

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    datefmt='%d-%m-%Y %H:%M:%S',
                    handlers=[
                        # logging.FileHandler("tx_service.log"),
                        logging.StreamHandler(sys.stdout)
                    ])


# Define a route for handling POST requests to "/proof"
@app.route("/proof", methods=["POST"])
def handle_tx():
    # Parse the JSON request body
    req_body = request.get_json()

    # Check the request body
    if "proof" not in req_body.keys():
        return jsonify({"status": "fail", "error": "There is no proof value"})
    if "pubkey" not in req_body.keys():
        return jsonify({"status": "fail", "error": "There is no pubkey value"})

    # Extract the transaction data from the request body
    proof = req_body["proof"]
    pubkey = req_body["pubkey"]
    logging.info(f'proof {proof}, pubkey{pubkey}')
    # Build the transaction
    message = {
        "relay_ton_msg": {
            "proof": proof,
            "pubkey": pubkey
        }
    }
    wallet = LocalWallet.from_mnemonic(mnemonic=WALLET_SEED, prefix='pussy')
    res = execute_contract(
        msg=message,
        contract_address=Address(CONTRACT_ADDRESS),
        signer_wallet=wallet,
        network_config=NETWORK_CONFIG
    )
    print(f'res: {res}')
    if res[0] is not True:
        logging.error(f'Contract error: {res[1]}')
        return jsonify({"status": "fail", "error": res[1]})
    logging.info(f'tx: {res}')
    return jsonify({"status": "success", "tx": res[1]})


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
