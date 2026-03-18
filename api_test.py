import requests

# Test Nominatim directly
headers = {'User-Agent': 'SmartPGApp/2.0'}

# Test 1: Nominatim for Kukatpally PGs
print("=== NOMINATIM TEST ===")
r = requests.get('https://nominatim.openstreetmap.org/search',
                 params={'q': 'PG in Kukatpally Hyderabad', 'format': 'json', 'limit': 10},
                 headers=headers, timeout=8)
print("Status:", r.status_code)
if r.status_code == 200:
    for e in r.json():
        print(e.get('display_name','')[:80])

# Test 2: Direct Overpass
print("\n=== OVERPASS TEST ===")
try:
    ov_query = '[out:json][timeout:10];(node["amenity"~"hostel"](around:5000,17.4948,78.3996););out center;'
    r2 = requests.get('http://overpass-api.de/api/interpreter', params={'data': ov_query}, timeout=12)
    print("Overpass status:", r2.status_code)
    print("Overpass response (first 200 chars):", r2.text[:200])
except Exception as e:
    print("Overpass error:", e)
