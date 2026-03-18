import requests

def test_overpass():
    lat, lon = 12.9592, 77.7011 # Marathahalli
    ov_query = f"""
    [out:json][timeout:25];
    (
      node(around:2000,{lat},{lon})["name"~"PG|Paying|Hostel", i];
      way(around:2000,{lat},{lon})["name"~"PG|Paying|Hostel", i];
    );
    out center;
    """
    try:
        r = requests.get("http://overpass-api.de/api/interpreter", params={'data': ov_query}, timeout=30)
        if r.status_code == 200:
            elements = r.json().get('elements', [])
            print(f"Total elements found: {len(elements)}")
            for el in elements[:10]:
                tags = el.get('tags', {})
                print(f"- {tags.get('name')}")
        else:
            print(f"Error Code: {r.status_code}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_overpass()
