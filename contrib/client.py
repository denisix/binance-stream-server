import requests, csv

CSV_URL = 'http://127.0.0.1:3000/trades/NBSUSDT/1623728700000/1623730500000'

with requests.get(CSV_URL, headers = { 'Accept-Encoding': 'gzip', 'token': 'my-secure-token' }, stream=True) as r:
    reader = csv.reader(r.iter_lines(), delimiter=',', quotechar='"')
    for row in reader:
        print row

