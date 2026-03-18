import requests
import json

def get_hostels_in_state(state):
    overpass_url = "http://overpass-api.de/api/interpreter"
    # Query for hostels in the state
    query = f"""
    [out:json][timeout:25];
    area["name"="{state}"]->.searchArea;
    (
      node["amenity"="hostel"](area.searchArea);
      way["amenity"="hostel"](area.searchArea);
      node["tourism"="hostel"](area.searchArea);
      way["tourism"="hostel"](area.searchArea);
    );
    out body;
    >;
    out skel qt;
    """
    response = requests.get(overpass_url, params={'data': query})
    data = response.json()
    
    cities = set()
    for element in data.get('elements', []):
        tags = element.get('tags', {})
        city = tags.get('addr:city') or tags.get('is_in:city')
        if city:
            cities.add(city)
    
    return sorted(list(cities))

if __name__ == "__main__":
    state = "Andhra Pradesh"
    cities = get_hostels_in_state(state)
    print(f"Cities with Hostels in {state}: {cities}")
