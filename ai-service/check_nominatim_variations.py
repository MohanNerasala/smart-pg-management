import requests

def test_nominatim(q):
    headers = {'User-Agent': 'SmartPGApp/1.0'}
    try:
        r = requests.get('https://nominatim.openstreetmap.org/search', 
                         params={'q': q, 'format': 'json', 'limit': 10}, 
                         headers=headers, timeout=10)
        if r.status_code == 200:
            data = r.json()
            print(f"Query: {q} | Results: {len(data)}")
            for el in data[:3]:
                print(f"  - {el.get('display_name')[:100]}")
        else:
            print(f"Query: {q} | Error: {r.status_code}")
    except Exception as e:
        print(f"Query: {q} | Error: {e}")

if __name__ == "__main__":
    test_nominatim("PG in Marathahalli, Bengaluru")
    test_nominatim("PG in Marthahalli, Bengaluru")
    test_nominatim("PG in Marathalli, Bengaluru")
    test_nominatim("Hostel in Marathahalli, Bengaluru")
    test_nominatim("Hostel in Marthahalli, Bengaluru")
