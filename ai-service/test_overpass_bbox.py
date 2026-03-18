import requests

def test():
    # Hyderabad BBox approx
    bbox = "17.3,78.3,17.6,78.6"
    query = f"""
    [out:json][timeout:25];
    (
      node["name"~"[Pp][Gg]|[Pp]aying [Gg]uest|[Cc]oliving|[Cc]olive"]({bbox});
      way["name"~"[Pp][Gg]|[Pp]aying [Gg]uest|[Cc]oliving|[Cc]olive"]({bbox});
    );
    out center;
    """
    res = requests.get('https://overpass-api.de/api/interpreter', params={'data': query})
    if res.status_code != 200:
        print(f"Error: {res.text}")
        return
        
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
