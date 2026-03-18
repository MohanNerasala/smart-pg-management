import requests
import json

lat, lon = 17.4948, 78.3996 # Kukatpally roughly

q = f"""
[out:json][timeout:15];
(
  node["amenity"~"hostel|guest_house|boarding_house"](around:3000,{lat},{lon});
  node["tourism"~"hostel|guest_house"](around:3000,{lat},{lon});
  node["name"~"PG|Hostel|Hostal|Pg|Guest|Accommodation", "i"](around:3000,{lat},{lon});
  way["amenity"~"hostel|guest_house"](around:3000,{lat},{lon});
  way["name"~"PG|Hostel|Hostal|Pg|Guest|Accommodation", "i"](around:3000,{lat},{lon});
);
out body;
"""

r = requests.get('http://overpass-api.de/api/interpreter', params={'data': q})
elems = r.json().get('elements', [])
print(f"Found {len(elems)} map locations.")
for e in elems[:10]:
    t = e.get('tags', {})
    print(t.get('name', 'Unnamed'), e.get('lat'), e.get('lon'))
