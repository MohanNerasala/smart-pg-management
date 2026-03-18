import requests
import json

def test_overpass_gudur():
    lat, lon = 14.1469524, 79.8478024
    radius = 5000  # 5km
    overpass_url = "http://overpass-api.de/api/interpreter"
    query = f"""
    [out:json][timeout:25];
    (
      node["amenity"~"hostel|guest_house|boarding_house"](around:{radius},{lat},{lon});
      node["tourism"~"hostel|guest_house|hotel"](around:{radius},{lat},{lon});
      node["name"~"PG|Hostel|Hostal|Pg|Lodge", "i"](around:{radius},{lat},{lon});
      way["amenity"~"hostel|guest_house|boarding_house"](around:{radius},{lat},{lon});
      way["tourism"~"hostel|guest_house|hotel"](around:{radius},{lat},{lon});
    );
    out body;
    """
    print(f"--- Overpass Query around {lat}, {lon} ---")
    r = requests.get(overpass_url, params={'data': query})
    if r.status_code == 200:
        data = r.json()
        print(f"Results: {len(data.get('elements', []))}")
        for el in data.get('elements', []):
            tags = el.get('tags', {})
            print(f" - {tags.get('name', 'Unnamed')} ({tags.get('amenity', 'N/A')}/{tags.get('tourism', 'N/A')})")
    else:
        print(f"Error: {r.status_code}")

if __name__ == "__main__":
    test_overpass_gudur()
