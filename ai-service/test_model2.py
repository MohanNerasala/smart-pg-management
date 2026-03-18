import sys
import codecs

# Force UTF-8 encoding for Windows console (to print star emojis or special chars)
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())

from model import predict_pgs_from_map

def test():
    print("Testing Hyderabad...")
    res = predict_pgs_from_map("Hyderabad", "Telangana")
    print(f"Results count: {len(res)}")
    for r in res[:5]:
        print(f"- {r['pgName']} (isPredicted: {r.get('isPredicted')})")

    print("\nTesting Bengaluru...")
    res2 = predict_pgs_from_map("Bengaluru", "Karnataka")
    print(f"Results count: {len(res2)}")
    for r in res2[:5]:
        print(f"- {r['pgName']} (isPredicted: {r.get('isPredicted')})")

if __name__ == "__main__":
    test()
