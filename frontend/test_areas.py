import requests
import json

def test():
    city = "Hyderabad"
    query = f"""
      [out:json][timeout:15];
      area["name"="{city}"]->.a;
      (
        node["place"="suburb"](area.a);
        node["place"="neighbourhood"](area.a);
      );
      out tags;
    """
    res = requests.post('https://overpass-api.de/api/interpreter', data={'data': query})
    data = res.json()
    areas = [e.get('tags', {}).get('name') for e in data.get('elements', []) if e.get('tags', {}).get('name')]
    unique_areas = sorted(list(set(areas)))
    print(f"Found {len(unique_areas)} areas in {city} via Overpass:")
    print(unique_areas[:10])

if __name__ == "__main__":
    test()
