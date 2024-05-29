from typing import Optional

from cosmpy.aerial.client import LedgerClient, NetworkConfig
from cosmpy.aerial.contract import LedgerContract
from cosmpy.aerial.wallet import LocalWallet
from cosmpy.crypto.address import Address


# from retry import retry


# @retry(delay=3, tries=3, backoff=2, max_delay=8)
def execute_contract(
        msg: dict,
        contract_address: Address,
        signer_wallet: LocalWallet,
        network_config: NetworkConfig,
        wait_for_finalization: bool = True,
        gas: Optional[int] = 1_000_000,
        funds: Optional[str] = None
) -> [bool, Optional[str]]:
    print(f'tx msg {msg}\tsigner_wallet {signer_wallet}')
    client = LedgerClient(cfg=network_config)
    contract = LedgerContract(
        client=client,
        address=contract_address,
        digest=None,
        path=None)
    print('start executing contract...')
    if not wait_for_finalization:
        tx = contract.execute(msg, signer_wallet, gas, funds=funds)
        return True, tx
    else:
        try:
            # NOTE will raise exception if tx simulation is not successful, need to catch it
            tx = contract.execute(msg, signer_wallet, gas, funds=funds)
        except Exception as e:
            return False, e.__str__()

        try:
            tx.wait_to_complete()
            if tx.response.is_successful():
                print(f'Gas used: {tx.response.gas_used:>,}')
                return True, tx.response
            else:
                return False, tx.response.code
        except Exception as e:
            return False, e.__str__()
