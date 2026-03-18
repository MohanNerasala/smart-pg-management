import requests
import json

def test_overpass_radius(lat, lon, radius=5000):
    overpass_url = "http://overpass-api.de/api/interpreter"
    # Query for hostels, guest houses, and anything with PG in the name
    query = f"""
    [out:json][timeout:25];
    (
      node(around:{radius},{lat},{lon})["amenity"~"hostel|guest_house|boarding_house"];
      node(around:{radius},{lat},{lon})["tourism"~"hostel|guest_house"];
      node(around:{radius},{lat},{lon})["name"~"PG|Hostel|Hostal|Pg|Lodge", i];
      way(around:{radius},{lat},{lon})["amenity"~"hostel|guest_house|boarding_house"];
      way(around:{radius},{lat},{lon})["tourism"~"hostel|guest_house"];
      way(around:{radius},{lat},{lon})["name"~"PG|Hostel|Hostal|Pg|Lodge", i];
    );
    out center;
    """
    try:
        r = requests.get(overpass_url, params={'data': query}, timeout=20)
        if r.status_code == 200:
            data = r.json()
            elements = data.get('elements', [])
            print(f"Results for ({lat}, {lon}): {len(elements)}")
            for el in elements:
                tags = el.get('tags', {})
                name = tags.get('name', 'Unnamed')
                lat_el = el.get('lat') or el.get('center', {}).get('lat')
                lon_el = el.get('lon') or el.get('center', {}).get('lon')
                print(f" - {name} at {lat_el}, {lon_el}")
        else:
            print(f"Error: {r.status_code} - {r.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    # Gudur coordinates
    print("Testing Gudur...")
    test_overpass_radius(14.1469524, 79.8478024)
    
    # Nellore coordinates (approx)
    print("\nTesting Nellore...")
    test_overpass_radius(14.4425, 79.9865)
