import requests

def test_broad_gudur():
    queries = [
        "PG in Gudur, Andhra Pradesh, India",
        "Hostel in Gudur, Andhra Pradesh, India",
        "Gudur PG",
        "Gudur Hostel"
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
    test_broad_gudur()
