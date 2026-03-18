from model import predict_pgs_from_map
import json

def verify_logic():
    print("--- Verifying Search Logic and Visibility ---")
    
    cities_to_test = [
        {"city": "Bengaluru", "state": "Karnataka", "area": "Marathahalli"},
        {"city": "Bengaluru", "state": "Karnataka", "area": "Marthahalli"},
        {"city": "Bengaluru", "state": "Karnataka", "area": "Marathalli"}
    ]
    
    for test in cities_to_test:
        area = test['area']
        print(f"\nTesting Area: {area}")
        try:
            results = predict_pgs_from_map(test['city'], test['state'], area)
            print(f"Results Found: {len(results)}")
            if results:
                # Print top 5 results
                for i, pg in enumerate(results[:5]):
                    print(f"{i+1}. {pg['pgName']} (Rating: {pg['rating']}, Area: {pg['area']})")
            else:
                print("No results found.")
        except Exception as e:
            print(f"Error testing {area}: {e}")

if __name__ == "__main__":
    verify_logic()
