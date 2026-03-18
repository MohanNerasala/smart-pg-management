import requests
import json

def test_variation(area):
    url = "http://127.0.0.1:5000/predict"
    payload = {'city': 'Bengaluru', 'state': 'Karnataka', 'area': area}
    try:
        r = requests.post(url, json=payload, timeout=15)
        if r.status_code == 200:
            data = r.json()
            print(f"Results for {area}: {len(data)}")
        else:
            print(f"Error: {r.status_code} for {area}")
    except Exception as e:
        print(f"Error: {e} for {area}")

if __name__ == "__main__":
    test_variation("Marathahalli")
    test_variation("Marthahalli")
    test_variation("Marathalli")
