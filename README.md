![License: MIT](https://img.shields.io/badge/License-MIT-green)
![GitHub package.json version](https://img.shields.io/github/package-json/v/denisix/binance-stream-server)
![GitHub package.json dynamic](https://img.shields.io/github/package-json/keywords/denisix/binance-stream-server)

# binance-stream-server
Real-time historical trades server for back-test purposes

### About
When you have trading strategy or idea and you want to test it on a real historical trades - you need some simple API to fetch the trades.
This project will help you create simple streaming server that will serve trades from database -> to HTTP/2 stream.
It's very performant and speedy.

If you don't know how to gather real-time Binance trades and store them in DB, please take a look at [binance-markets-streamer](https://github.com/denisix/binance-markets-streamer) project.

### Get started
Okay, if you have prepared the database, filled with the data, now you can clone the repo:
```sh
git clone https://github.com/denisix/binance-stream-server
npm i
npm start
```

or use the docker compose V2 and simply:
```sh
npm run docker
```

ok, you will see something like:

```
2022-07-17 01:52:52 - starting run()..
2022-07-17 01:52:52 - DB: connect..
2022-07-17 01:52:52 - starting server
2022-07-17 01:52:52 - dump symbols
2022-07-17 01:52:52 - listeding on port 3000
```

that means you can use the API:
* fetch available markets (symbols):
```sh
curl -kH 'token: my-secure-token' https://127.0.0.1:3000/symbols
1INCHBTC,1INCHBUSD,AAVEBNB,AAVEBTC,AAVEBUSD,AAVEETH,ACHBUSD,ACMBTC,ACMBUSD,ADABNB....
```

* fetch trades on **XRPBTC** (market) from **1658004733271** (timestamp) till **1658004833371** (timestamp):
```sh
curl -vk -H 'token: my-secure-token' https://127.0.0.1:3000/trades/XRPBTC/1658004733271/1658004833371
time,count,price,quantity,side,buyId,sellId
1658004736753,141029094,0.00001664,152,0,978428173,978427867
1658004738374,141029095,0.00001663,48,1,978427389,978428197
1658004738374,141029096,0.00001663,69,1,978427709,978428197
1658004738456,141029097,0.00001663,21,1,978427709,978428199
1658004738456,141029098,0.00001663,220,1,978427941,978428199
1658004738456,141029099,0.00001663,11,1,978428050,978428199
1658004738456,141029100,0.00001663,604,1,978428136,978428199
1658004739384,141029101,0.00001664,7,0,978428215,978427867
1658004742589,141029102,0.00001664,25,0,978428242,978427867
```

in case you want gzipped data, please add header `accept-encoding: gzip` to your request, example using curl:
```sh
curl -k -H 'token: my-secure-token' -H 'accept-encoding: gzip' https://127.0.0.1:3000/trades/XRPBTC/1658004733271/1658004833371 --output - | zcat 
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1446    0  1446    0     0  33627      0 --:--:-- --:--:-- --:--:-- 33627
1658004736753,141029094,0.00001664,152,0,978428173,978427867
1658004738374,141029095,0.00001663,48,1,978427389,978428197
1658004738374,141029096,0.00001663,69,1,978427709,978428197
1658004738456,141029097,0.00001663,21,1,978427709,978428199
1658004738456,141029098,0.00001663,220,1,978427941,978428199
1658004738456,141029099,0.00001663,11,1,978428050,978428199
1658004738456,141029100,0.00001663,604,1,978428136,978428199
1658004739384,141029101,0.00001664,7,0,978428215,978427867
```
