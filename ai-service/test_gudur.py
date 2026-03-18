import requests

def test_gudur():
    city = "Gudur"
    state = "Andhra Pradesh"
    query = f"PG in {city}, {state}, India"
    headers = {'User-Agent': 'SmartPGApp/1.0'}
    r = requests.get('https://nominatim.openstreetmap.org/search', 
                     params={'q': query, 'format': 'json', 'limit': 10}, 
                     headers=headers)
    print(f"Gudur Results: {len(r.json())}")
    for item in r.json():
        print(f" - {item['display_name']}")

if __name__ == "__main__":
    test_gudur()
