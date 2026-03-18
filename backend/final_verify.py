import urllib.request
import urllib.parse
import urllib.error
import json
import socket

def verify():
    print("--- 🔍 FINAL BOOKING VERIFICATION (Robust Version) ---")
    base_url = "http://localhost:8080"
    
    # 0. Check if Server is even listening
    print(f"Checking if server is running on {base_url}...")
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(2)
            s.connect(("127.0.0.1", 8080))
        print("✅ Server is UP and listening.")
    except Exception as e:
        print(f"❌ ERROR: Server is DOWN or not reachable on 8080. ({e})")
        print("Please make sure 'mvn spring-boot:run' is finished starting up.")
        return

    try:
        # 1. Login
        print("\nStep 1: Logging in as admin...")
        login_url = f"{base_url}/auth/login"
        login_data = json.dumps({"email": "admin@staynest", "password": "admin123"}).encode('utf-8')
        req = urllib.request.Request(login_url, data=login_data, headers={'Content-Type': 'application/json'}, method='POST')
        
        try:
            with urllib.request.urlopen(req) as response:
                res_data = json.loads(response.read().decode())
                token = res_data.get("token")
                print("✅ Login Successful.")
        except urllib.error.HTTPError as e:
            print(f"❌ Login Failed (HTTP {e.code})")
            print(f"Response: {e.read().decode()}")
            return

        # 2. Update Booking 22
        print("\nStep 2: Updating booking ID 22 to 'CONFIRMED'...")
        update_url = f"{base_url}/booking/updateStatus/22?status=CONFIRMED"
        req2 = urllib.request.Request(update_url, headers={'Authorization': f'Bearer {token}'}, method='PUT')
        
        try:
            with urllib.request.urlopen(req2) as response2:
                print(f"✅ Update HTTP Status: {response2.status}")
                res_text = response2.read().decode()
                print(f"Response Body: {res_text}")
                if "updated successfully" in res_text.lower():
                    print("\n🚀 SUCCESS: The booking fix is VERIFIED and WORKING!")
                else:
                    print("\n⚠️ WARNING: Server responded, but the booking might not have been found.")
        except urllib.error.HTTPError as e:
            print(f"❌ Update Failed (HTTP {e.code})")
            print(f"Server Error Message: {e.read().decode()}")

    except Exception as e:
        print(f"\n❌ SCRIPT ERROR: {str(e)}")

if __name__ == "__main__":
    verify()
