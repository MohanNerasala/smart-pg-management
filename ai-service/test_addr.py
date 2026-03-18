import requests

def test_address_details(state="Andhra Pradesh"):
    headers = {'User-Agent': 'SmartPGApp/1.0'}
    params = {
        'q': f"PG in {state}",
        'format': 'json',
        'addressdetails': 1,
        'limit': 10
    }
    r = requests.get('https://nominatim.openstreetmap.org/search', params=params, headers=headers)
    if r.status_code == 200:
        for el in r.json():
            addr = el.get('address', {})
            name = el.get('display_name', '').split(',')[0]
            city = addr.get('city') or addr.get('town') or addr.get('village') or addr.get('county')
            print(f"Name: {name} -> City/Town/District: {city}")

if __name__ == "__main__":
    test_address_details()
