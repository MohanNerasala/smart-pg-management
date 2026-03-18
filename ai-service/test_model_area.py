from model import predict_pgs_from_map
import codecs, sys

sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())

print("Testing Madhapur...")
res = predict_pgs_from_map("Hyderabad", "Telangana", "Madhapur")
print(f"Count: {len(res)}")
for x in res[:30]:
    print(f"- {x['pgName']} ({x.get('area', x.get('location'))})")
