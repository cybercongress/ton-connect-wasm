## run service by python
```bash
pip3 install -r requirements.txt
export FLASK_APP=app.py && python -m flask run --host=0.0.0.0 --port=4000
```

## run service by docker
```bash
docker-compouse up --build
```

## check service
```bash
curl --request POST --url http://localhost:4000/proof -H 'accept: application/json' -H 'content-type: application/json' \
-d '{"proof": {"proof": {"domain": {"lengthBytes": 36, "value": "ton-wasm-cyber-hackathon.netlify.app"}, "signature": "tN5HZQWu0WrtGUQPMW8okSgA28IZJ9oAB6VoDoor4iOoyflA1HRpmXZ5fstdEnWASRwFMjw0zNPScAXy8d03DA==", "payload": "eyJtc2dfdHlwZSI6Im1hcF9uaWNrbmFtZSIsIm1zZ19kYXRhIjoiY3lib3Jnc2hlYWQifQ==", "timestamp": 1716987585, "state_init": " "}, "address": "0:d608e557aa3216e9152ad3e781326d175df0c65e08b08f980fd63266fa6dbe06", "network": "-239"}, "pubkey": "07774b49ea9c97095b718d5d8c691fd8e8900d496f73005442e8243c72753196"}'   
```