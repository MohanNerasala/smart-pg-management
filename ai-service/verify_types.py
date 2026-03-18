import requests

def verify_type_filtering(city="Hyderabad", state="Telangana", area="Madhapur"):
    try:
        res = requests.post('http://127.0.0.1:5000/predict', json={
            'city': city,
            'state': state,
            'area': area
        })
        data = res.json()
        
        print(f"\n--- Type Verification for {city} ---")
        types_found = {}
        for pg in data:
            t = pg.get('type', 'Unknown')
            types_found[t] = types_found.get(t, 0) + 1
            print(f"- {pg['pgName']}: Type={t}")
            
        print("\nSummary of Types Found:")
        for t, count in types_found.items():
            print(f"  {t}: {count}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_type_filtering()
    verify_type_filtering(city="Nellore", state="Andhra Pradesh", area="Gudur")
