import requests
import sys

# The live backend URL provided by the user
BASE_URL = "https://smart-pg-management.onrender.com"

def test_registration():
    url = f"{BASE_URL}/auth/register"
    # Using a unique email to avoid "Duplicate Email" errors
    payload = {
        "name": "Cloud Test User",
        "email": "cloudtest_" + str(int(requests.utils.time.time())) + "@test.com",
        "password": "password123",
        "phone": "1234567890"
    }
    
    print(f"Testing Registration at: {url}")
    print(f"Payload: {payload}")
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            print("✅ SUCCESS: Registration works on the live backend!")
        else:
            print("❌ FAILED: The backend returned an error.")
            
    except Exception as e:
        print(f"❌ ERROR: Could not reach the backend. {str(e)}")

if __name__ == "__main__":
    test_registration()
