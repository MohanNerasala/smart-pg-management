import time
import requests

lat, lon = 17.4483, 78.3915
overpass_url = "https://overpass-api.de/api/interpreter"

def test_query(name, query):
    start = time.time()
    try:
        response = requests.get(overpass_url, params={'data': query}, timeout=10)
        elapsed = time.time() - start
        if response.status_code == 200:
            data = response.json()
            elements = data.get('elements', [])
            print(f"[{name}] SUCCESS: {len(elements)} results in {elapsed:.2f} seconds")
        else:
            print(f"[{name}] ERROR: {response.status_code} in {elapsed:.2f} seconds")
    except Exception as e:
        elapsed = time.time() - start
        print(f"[{name}] FAILED: {str(e)} in {elapsed:.2f} seconds")

# 1. Fetch ALL nodes with a name within 2km (NO REGEX)
q3 = f"""
[out:json][timeout:10];
(
  node["name"](around:2000, {lat}, {lon});
);
out center;
"""

# 2. Fetch specific indexed tags (NO REGEX)
q4 = f"""
[out:json][timeout:10];
(
  node["amenity"="hostel"](around:4000, {lat}, {lon});
  way["amenity"="hostel"](around:4000, {lat}, {lon});
  node["tourism"="guest_house"](around:4000, {lat}, {lon});
  way["tourism"="guest_house"](around:4000, {lat}, {lon});
  node["building"="dormitory"](around:4000, {lat}, {lon});
  way["building"="dormitory"](around:4000, {lat}, {lon});
);
out center;
"""

test_query("2km All Named Nodes", q3)
test_query("4km Specific Tags Only", q4)
