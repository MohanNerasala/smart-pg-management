import requests

def get_coords(query):
    headers = {'User-Agent': 'SmartPGApp/1.0'}
    r = requests.get('https://nominatim.openstreetmap.org/search', 
                     params={'q': query, 'format': 'json', 'limit': 1}, 
                     headers=headers)
    if r.status_code == 200 and r.json():
        return r.json()[0]['lat'], r.json()[0]['lon']
    return None, None

def search_overpass_strict(lat, lon):
    overpass_url = "http://overpass-api.de/api/interpreter"
    # Smaller radius (2km) and more specific tags to avoid timeouts
    query = f"""
    [out:json][timeout:15];
    (
      node(around:2000,{lat},{lon})["amenity"~"hostel|guest_house"];
      node(around:2000,{lat},{lon})["tourism"~"hostel|guest_house|hotel"];
      node(around:2000,{lat},{lon})["name"~"PG|Hostel|Lodge", i];
    );
    out body;
    """
    r = requests.get(overpass_url, params={'data': query})
    if r.status_code == 200:
        return r.json().get('elements', [])
    return []

if __name__ == "__main__":
    for place in ["Gudur, Nellore", "Nellore, Andhra Pradesh"]:
        print(f"--- {place} ---")
        lat, lon = get_coords(place)
        if lat:
            print(f"Found {lat}, {lon}")
            results = search_overpass_strict(lat, lon)
            print(f"Overpass found {len(results)} results")
            for el in results:
                print(f" - {el.get('tags', {}).get('name', 'Unnamed')}")
        else:
            print("Geocode failed")
