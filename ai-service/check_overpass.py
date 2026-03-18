import requests
import json

def check_overpass_marthahalli():
    url = "http://overpass-api.de/api/interpreter"
    # Search around Marthahalli Bridge area
    lat, lon = 12.955, 77.700
    
    query = f"""
    [out:json][timeout:25];
    (
      node(around:2000,{lat},{lon})["amenity"~"hostel|guest_house"];
      way(around:2000,{lat},{lon})["amenity"~"hostel|guest_house"];
      node(around:2000,{lat},{lon})["name"~"PG|Hostel|Paying", i];
      way(around:2000,{lat},{lon})["name"~"PG|Hostel|Paying", i];
    );
    out center;
    """
    
    print(f"Querying Overpass around {lat}, {lon}...")
    r = requests.get(url, params={'data': query}, timeout=30)
    if r.status_code == 200:
        elements = r.json().get('elements', [])
        print(f"Found {len(elements)} elements.")
        for el in elements[:15]:
            t = el.get('tags', {})
            name = t.get('name', 'N/A')
            amenity = t.get('amenity', 'N/A')
            tourism = t.get('tourism', 'N/A')
            print(f"- {name} (Amenity: {amenity}, Tourism: {tourism})")
    else:
        print(f"Error: {r.status_code}")

if __name__ == "__main__":
    check_overpass_marthahalli()
