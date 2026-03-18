import requests

def check_spelling():
    headers = {'User-Agent': 'SmartPGApp/1.0'}
    for q in ["Marthahalli, Bengaluru", "Marathahalli, Bengaluru"]:
        r = requests.get('https://nominatim.openstreetmap.org/search', 
                         params={'q': q, 'format': 'json', 'limit': 1}, 
                         headers=headers)
        if r.status_code == 200 and r.json():
            print(f"{q}: {r.json()[0]['lat']}, {r.json()[0]['lon']}")
        else:
            print(f"{q}: Not found")

if __name__ == "__main__":
    check_spelling()
