import requests

def test_gudur_location():
    q = "Gudur, Andhra Pradesh, India"
    headers = {'User-Agent': 'SmartPGApp/1.0'}
    print(f"--- Query: {q} ---")
    r = requests.get('https://nominatim.openstreetmap.org/search', 
                     params={'q': q, 'format': 'json', 'limit': 1}, 
                     headers=headers)
    if r.status_code == 200:
        results = r.json()
        print(f"Results: {len(results)}")
        for item in results:
            print(f" - {item['display_name']}")
            print(f" - Lat: {item['lat']}, Lon: {item['lon']}")
    else:
        print(f"Error: {r.status_code}")

if __name__ == "__main__":
    test_gudur_location()
