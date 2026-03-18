import requests

def debug_gudur():
    headers = {'User-Agent': 'SmartPGApp/1.0'}
    params = {
        'q': "Gudur, Andhra Pradesh",
        'format': 'json',
        'addressdetails': 1,
        'limit': 1
    }
    r = requests.get('https://nominatim.openstreetmap.org/search', params=params, headers=headers)
    if r.status_code == 200 and r.json():
        print(f"Address for Gudur: {r.json()[0]['address']}")

if __name__ == "__main__":
    debug_gudur()
