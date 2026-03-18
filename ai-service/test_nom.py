import time
import requests
from concurrent.futures import ThreadPoolExecutor

def fetch_nominatim(kw, area, city):
    query = f"{kw} in {area}, {city}, India" if area else f"{kw} in {city}, India"
    r = requests.get('https://nominatim.openstreetmap.org/search', 
                     params={'q': query, 'format': 'json', 'limit': 50}, 
                     headers={'User-Agent': 'SmartPGApp/1.0'})
    if r.status_code == 200:
        return r.json()
    return []

start = time.time()
with ThreadPoolExecutor(max_workers=3) as executor:
    futures = [
        executor.submit(fetch_nominatim, "PG", "Madhapur", "Hyderabad"),
        executor.submit(fetch_nominatim, "Coliving", "Madhapur", "Hyderabad"),
        executor.submit(fetch_nominatim, "Hostel", "Madhapur", "Hyderabad")
    ]
    results = []
    for f in futures:
        results.extend(f.result())

# Deduplicate
unique = {r['place_id']: r for r in results if r.get('place_id')}
end = time.time()

print(f"Fetched {len(unique)} unique places in {end-start:.2f} seconds!")
for k, v in list(unique.items())[:10]:
    name = v.get('name') or v.get('display_name', '').split(',')[0]
    print(f"- {name}")
