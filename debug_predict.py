import requests, json

# Test: Is the AI service running and returning real results?
res = requests.post('http://127.0.0.1:5000/predict', json={'city':'Hyderabad', 'state':'Telangana', 'area':'Kukatpally'}).json()
print('--- PREDICTION RESULTS ---')
for r in res[:10]:
    print(r.get('pgId','')[:15], '|', r.get('isPredicted'), '|', r.get('pgName'))

# Also test Overpass directly
print('\n--- OVERPASS DIRECT TEST ---')
lat, lon = 17.4948, 78.3996
ov_query = """
[out:json][timeout:15];
(
  node["amenity"~"hostel|guest_house"](around:6000,17.4948,78.3996);
  node["name"~"PG|Hostel|Guest", "i"](around:6000,17.4948,78.3996);
  way["amenity"~"hostel|guest_house"](around:6000,17.4948,78.3996);
);
out center;
"""
r2 = requests.get('http://overpass-api.de/api/interpreter', params={'data': ov_query}, timeout=15)
elems = r2.json().get('elements', [])
print(f'Overpass found: {len(elems)} elements')
for e in elems[:10]:
    print(e.get('tags', {}).get('name', 'no-name'), e.get('lat'), e.get('lon'))
