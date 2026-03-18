import requests
import json
import re

def search_ddg_local(query):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    }
    # Get VQD
    res = requests.get(f"https://duckduckgo.com/?q={requests.utils.quote(query)}", headers=headers)
    vqd = None
    match = re.search(r'vqd=([\d-]+)', res.text)
    if match:
        vqd = match.group(1)
    
    if not vqd:
        print("VQD fail")
        return []

    local_url = "https://duckduckgo.com/local.js"
    params = {'q': query, 'vqd': vqd, 'mkt': 'en-in'}
    res = requests.get(local_url, params=params, headers=headers)
    if res.status_code == 200:
        data = res.json()
        results = data.get('results', [])
        return results
    return []

if __name__ == "__main__":
    for q in ["PG in Gudur, Nellore", "Hostel in Gudur, Nellore"]:
        print(f"--- {q} ---")
        results = search_ddg_local(q)
        print(f"Found {len(results)} results")
        for r in results:
            print(f" - {r.get('name')} | {r.get('address')}")
