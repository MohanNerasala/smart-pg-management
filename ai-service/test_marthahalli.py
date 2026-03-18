import requests
import json

def test_marthahalli():
    url = "http://127.0.0.1:5000/predict"
    payload = {'city': 'Bengaluru', 'state': 'Karnataka', 'area': 'Marthahalli'}
    try:
        r = requests.post(url, json=payload, timeout=15)
        if r.status_code == 200:
            data = r.json()
            print(f"Results for Marthahalli: {len(data)}")
            for p in data[:10]:
                print(f"- {p['pgName']} ({p['type']})")
        else:
            print(f"Error: {r.status_code}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_marthahalli()
