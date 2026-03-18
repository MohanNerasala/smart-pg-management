import model
import json

def test_direct():
    print("--- Direct Model Call Diagnostic ---")
    results = model.predict_pgs_from_map("Bengaluru", "Karnataka", "Marthahalli")
    print(f"\nResults count: {len(results)}")
    for p in results[:10]:
        print(f"- {p['pgName']} ({p['type']})")

if __name__ == "__main__":
    test_direct()
