import requests
import time

def verify_optimized_predictions(city="Nellore", state="Andhra Pradesh", area="Gudur"):
    start_time = time.time()
    try:
        res = requests.post('http://127.0.0.1:5000/predict', json={
            'city': city,
            'state': state,
            'area': area
        })
        duration = time.time() - start_time
        data = res.json()
        
        print(f"\n--- Results for {city}/{area} ---")
        print(f"Time Taken: {duration:.2f} seconds")
        print(f"Number of PGs found: {len(data)}")
        
        non_pgs = [pg['pgName'] for pg in data if "pg" not in pg['pgName'].lower() and "paying guest" not in pg['pgName'].lower()]
        
        if non_pgs:
            print(f"FAIL: Found non-PG results: {non_pgs}")
        else:
            print("SUCCESS: All results are PGs")
            
        print("Top 10 Result Names:")
        for pg in data[:10]:
            print(f"- {pg['pgName']}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_optimized_predictions()
    verify_optimized_predictions(city="Hyderabad", state="Telangana", area="Madhapur")
