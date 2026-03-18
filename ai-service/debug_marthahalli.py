import requests
import json

def debug_marthahalli():
    headers = {'User-Agent': 'SmartPGApp/1.0'}
    queries = ["PG in Marthahalli, Bengaluru", "Paying Guest in Marthahalli, Bengaluru", "Hostel in Marthahalli, Bengaluru"]
    
    print("--- Diagnostic Search for Marthahalli ---")
    for q in queries:
        print(f"\nQuery: {q}")
        r = requests.get('https://nominatim.openstreetmap.org/search', 
                         params={'q': q, 'format': 'json', 'limit': 10}, 
                         headers=headers)
        if r.status_code == 200:
            for el in r.json():
                name = el.get('display_name', '').split(',')[0]
                print(f"- {name}")
        else:
            print("Failed.")

if __name__ == "__main__":
    debug_marthahalli()
