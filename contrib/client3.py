import httpx

with httpx.Client(http2=True, verify=False) as client:
    r = client.get('https://127.0.0.1:3000/trades/NEOBTC/1652213827010/1652216123669', headers={'Accept-Encoding': 'gzip', 'token': 'my-secure-token' })
    print(r.text)

with httpx.Client(http2=True, verify=False) as client:
    r = client.get('https://127.0.0.1:3000/symbols', headers={'Accept-Encoding': 'gzip', 'token': 'my-secure-token' })
    print(r.text)
