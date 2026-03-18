import requests

def verify_mapping(state="Andhra Pradesh"):
    try:
        res = requests.post('http://127.0.0.1:5000/locations', json={'state': state})
        data = res.json()
        hubs = data.get('hubs', [])
        towns_map = data.get('townsMap', {})
        
        print(f"Hubs: {hubs}")
        print("\nMapping Examples:")
        for city in ["Nellore", "Vijayawada", "Visakhapatnam"]:
            mapped = towns_map.get(city, [])
            print(f"Areas in {city}: {mapped[:15]}...")
            if "Gudur" in mapped:
                print(f"  ✅ SUCCESS: Gudur is mapped to {city}")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_mapping()
