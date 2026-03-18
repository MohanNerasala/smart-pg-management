import requests
import json
import sys
import codecs
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())

def search_ddg_maps(query):
    # Step 1: Get VQD token
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }
    html_res = requests.get(f"https://duckduckgo.com/?q={requests.utils.quote(query)}&ia=web", headers=headers)
    vqd = None
    for line in html_res.text.split('\n'):
        if 'vqd=' in line:
            import re
            match = re.search(r'vqd=([\d-]+)', line)
            if match:
                vqd = match.group(1)
                break
    
    if not vqd:
        print("Could not get VQD token. Using fallback raw call.")

    # Step 2: Query Local API
    local_url = "https://duckduckgo.com/local.js"
    params = {
        'q': query,
        'vqd': vqd if vqd else "",
        'mkt': 'en-in',
    }
    res = requests.get(local_url, params=params, headers=headers)
    
    if res.status_code != 200:
        print(f"Error: {res.status_code}")
        return
        
    try:
        data = res.json()
        results = data.get('results', [])
        if not results and 'features' in data: # sometimes it returns geojson
             # parse geojson
             for f in data.get('features', []):
                 props = f.get('properties', {})
                 print(f"- {props.get('name', props.get('title'))} (GeoJSON)")
                 
        for r in results:
            print(f"- {r.get('name')} | {r.get('address')} | {r.get('coordinates')}")
    except Exception as e:
        print(f"JSON Parse Error: {e}")
        print(res.text[:500])

if __name__ == "__main__":
    search_ddg_maps("PG in Madhapur Hyderabad")
