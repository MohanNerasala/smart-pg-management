import requests

def test():
    query = """
    [out:json][timeout:25];
    area["name"="Hyderabad"]->.a;
    (
      node["name"~"[Pp][Gg]|[Pp]aying [Gg]uest|[Cc]oliving|[Cc]olive"](area.a);
      way["name"~"[Pp][Gg]|[Pp]aying [Gg]uest|[Cc]oliving|[Cc]olive"](area.a);
    );
    out center;
    """
    res = requests.get('https://overpass-api.de/api/interpreter', params={'data': query})
    data = res.json().get('elements', [])
    print(len(data))
    
    # Filter them
    valid = []
    for el in data:
        name = el.get('tags', {}).get('name', '')
        if "hostel" in name.lower() or "house" in name.lower() or "college" in name.lower():
            continue
        valid.append(name)
        
    print(f"Valid PGs found: {len(valid)}")
    print(valid[:10])

if __name__ == "__main__":
    test()
