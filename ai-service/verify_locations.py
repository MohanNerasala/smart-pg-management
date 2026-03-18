import requests
import json

def test_locations_endpoint():
    url = "http://127.0.0.1:5000/locations"
    payload = {"state": "Andhra Pradesh"}
    try:
        response = requests.post(url, json=payload, timeout=15)
        if response.status_code == 200:
            cities = response.json()
            print(f"Discovered {len(cities)} cities in Andhra Pradesh.")
            print(f"All Cities: {cities}")
            if "Gudur" in cities:
                print("SUCCESS: Gudur discovered!")
            else:
                print("INFO: Gudur NOT discovered.")
        else:
            print(f"Error: {response.status_code}, {response.text}")
    except Exception as e:
        print(f"Exception during test: {e}")

if __name__ == "__main__":
    test_locations_endpoint()
