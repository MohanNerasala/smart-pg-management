import sys
import codecs
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())

from model import predict_pgs_from_map

def verify_gudur_prediction():
    print("Simulating search for City: 'All Cities / Nearby Towns', Area: 'Gudur'")
    results = predict_pgs_from_map("All Cities / Nearby Towns", "Andhra Pradesh", "Gudur")
    print(f"Results: {len(results)}")
    for pg in results:
        # Avoid emoji in console if needed or handle encoding
        name = pg['pgName']
        print(f" - {name} (Predicted: {pg['isPredicted']})")

if __name__ == "__main__":
    verify_gudur_prediction()
