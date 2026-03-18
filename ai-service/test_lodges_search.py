import requests

def test_lodges_gudur():
    queries = [
        "Lodge in Gudur, Andhra Pradesh, India",
        "Guest House in Gudur, Andhra Pradesh, India",
        "Gudur Lodge",
        "Gudur Guest House"
    ]
    headers = {'User-Agent': 'SmartPGApp/1.0'}
    for q in queries:
        print(f"--- Query: {q} ---")
        r = requests.get('https://nominatim.openstreetmap.org/search', 
                         params={'q': q, 'format': 'json', 'limit': 10}, 
                         headers=headers)
        if r.status_code == 200:
            results = r.json()
            print(f"Results: {len(results)}")
            for item in results:
                print(f" - {item['display_name']}")
        else:
            print(f"Error: {r.status_code}")

if __name__ == "__main__":
    test_lodges_gudur()
