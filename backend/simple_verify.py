import requests
import json

try:
    # 1. Login
    r = requests.post("http://localhost:8080/auth/login", json={"email": "admin@staynest", "password": "admin123"})
    print(f"Login Status: {r.status_code}")
    if r.status_code != 200:
        print(f"Login Fail Body: {r.text}")
        exit()
    
    token = r.json().get("token")
    
    # 2. Update Status
    r2 = requests.put("http://localhost:8080/booking/updateStatus/22?status=CONFIRMED", 
                      headers={"Authorization": f"Bearer {token}"})
    print(f"Update Status: {r2.status_code}")
    print(f"Update Body: {r2.text}")

except Exception as e:
    print(f"Error: {str(e)}")
