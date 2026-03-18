import time
import requests

lat, lon = 17.4483, 78.3915
overpass_url = "https://overpass-api.de/api/interpreter"

def test_query(name, query):
    start = time.time()
    try:
        response = requests.get(overpass_url, params={'data': query}, timeout=15)
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

# 1. Current Heavy Query
q1 = f"""
[out:json][timeout:15];
(
  node["name"~"[Pp][Gg]|[Pp]aying [Gg]uest|[Cc]oliving|[Cc]olive"](around:8000, {lat}, {lon});
  way["name"~"[Pp][Gg]|[Pp]aying [Gg]uest|[Cc]oliving|[Cc]olive"](around:8000, {lat}, {lon});
  node["amenity"~"hostel|student_accommodation"](around:8000, {lat}, {lon});
  way["amenity"~"hostel|student_accommodation"](around:8000, {lat}, {lon});
);
out center;
"""

# 2. Optimized Lower Radius 
q2 = f"""
[out:json][timeout:15];
(
  node["name"~"[Pp][Gg]|[Pp]aying [Gg]uest|[Cc]oliving|[Cc]olive"](around:3000, {lat}, {lon});
  way["name"~"[Pp][Gg]|[Pp]aying [Gg]uest|[Cc]oliving|[Cc]olive"](around:3000, {lat}, {lon});
);
out center;
"""

test_query("8km Heavy Regex", q1)
test_query("3km PG Regex Only", q2)
