import requests  # type: ignore
import json  # type: ignore


def raw_debug():
    headers = {'User-Agent': 'SmartPGApp/1.0'}
    q = "Mens Hostel in Marthahalli, Bengaluru"
    r = requests.get('https://nominatim.openstreetmap.org/search', 
                     params={'q': q, 'format': 'json', 'limit': 15}, 
                     headers=headers)
    print(f"Query: {q}")
    if r.status_code == 200:
        data = r.json()
        print(f"Count: {len(data)}")
        for el in data:
            print(f"- {el.get('display_name')}")
    else:
        print(f"Error: {r.status_code}")

if __name__ == "__main__":
    raw_debug()
