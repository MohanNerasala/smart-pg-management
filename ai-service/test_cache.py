import time
from model import predict_pgs_from_map

print("Running first search (should hit network)...")
start = time.time()
predict_pgs_from_map("Hyderabad", "Telangana", "Madhapur")
end1 = time.time() - start
print(f"First search took {end1:.4f} seconds")

print("Running second search (should hit cache)...")
start = time.time()
predict_pgs_from_map("Hyderabad", "Telangana", "Madhapur")
end2 = time.time() - start
print(f"Second search took {end2:.4f} seconds")

if end2 < 0.01:
    print("Cache successfully working and instantaneous!")
