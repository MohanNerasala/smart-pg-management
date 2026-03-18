import requests

def test_lodges_only_gudur():
    q = "Lodge in Gudur, Nellore"
    headers = {'User-Agent': 'SmartPGApp/1.0'}
    print(f"--- Query: {q} ---")
    r = requests.get('https://nominatim.openstreetmap.org/search', 
                     params={'q': q, 'format': 'json', 'limit': 20}, 
                     headers=headers)
    if r.status_code == 200:
        results = r.json()
        print(f"Results: {len(results)}")
        for item in results:
            print(f" - {item['display_name']}")
    else:
        print(f"Error: {r.status_code}")

if __name__ == "__main__":
    test_lodges_only_gudur()
