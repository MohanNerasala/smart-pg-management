import requests
from bs4 import BeautifulSoup
import json
import re

def search_ddg_html(query):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }
    
    # 1. Get VQD
    res = requests.get(f"https://duckduckgo.com/?q={requests.utils.quote(query)}&ia=web", headers=headers)
    vqd = None
    match = re.search(r'vqd=([\d-]+)', res.text)
    if match:
        vqd = match.group(1)
    
    if not vqd:
        print("Failed to get VQD")
        return

    # 2. Get Local results
    url = f"https://duckduckgo.com/local.js?q={requests.utils.quote(query)}&vqd={vqd}&mkt=en-in"
    res2 = requests.get(url, headers=headers)
    
    if res2.status_code == 200:
        data = res2.json()
        results = data.get('results', [])
        for r in results[:10]:
            print(f"- {r.get('name')} | {r.get('address')}")
    else:
        print(f"Failed DDG Local: {res2.status_code}")

search_ddg_html("PG in Madhapur Hyderabad")
