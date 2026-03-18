import requests

print("--- 🔍 FINAL VERIFICATION: Booking Status Sync ---")

def try_login(email, password):
    login_url = "http://localhost:8080/auth/login"
    login_data = {"email": email, "password": password}
    print(f"Attempting login for: {email} with {password}")
    r = requests.post(login_url, json=login_data)
    if r.status_code == 200:
        return r.json().get("token")
    else:
        print(f"Login failed for {email}: {r.status_code}")
        print(f"Response Body: {r.text}")
        return None

try:
    token = try_login("admin@staynest", "admin123")
    if not token:
        token = try_login("admin@staynest.com", "admin123")
    
    if not token:
        print("❌ All login attempts failed. Backend might not have seeded the user properly yet.")
        exit()
        
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Admin Login Successful.")

    # 2. Try updating booking 22 to CONFIRMED
    update_url = "http://localhost:8080/booking/updateStatus/22?status=CONFIRMED"
    r_update = requests.put(update_url, headers=headers)
    
    print(f"Update response status: {r_update.status_code}")
    print(f"Update response body: {r_update.text}")

    if r_update.status_code == 200:
        print("🎉 SUCCESS: The 500 error is solved!")
    else:
        print("⚠️ Failed with status code above. Check the body for Java exception details.")

except Exception as e:
    print(f"❌ Verification script failed: {e}")

