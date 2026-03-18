
import json
import urllib.request
import urllib.error

def debug_bookings():
    login_url = "http://localhost:8080/auth/login"
    bookings_url = "http://localhost:8080/booking/all"
    
    login_data = json.dumps({"email": "admin@staynest", "password": "admin123"}).encode('utf-8')
    
    try:
        # Step 1: Login
        print(f"Logging in to {login_url}...")
        req = urllib.request.Request(login_url, data=login_data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as response:
            auth_response = json.loads(response.read().decode())
            token = auth_response.get('token')
            if not token:
                print("Failed to get token from login.")
                return
            print("Login successful.")

        # Step 2: Fetch bookings
        print(f"Fetching bookings from {bookings_url}...")
        req = urllib.request.Request(bookings_url, headers={'Authorization': f'Bearer {token}'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            print(f"Found {len(data)} bookings.")
            
            for b in data:
                amount = b.get('totalAmount')
                print(f"ID: {b.get('bookingId')}, Status: {b.get('status')}, Amount: {amount}")
                if 'totalAmount' not in b:
                    print(f"  WARNING: 'totalAmount' key missing in JSON for ID {b.get('bookingId')}")
            
    except urllib.error.URLError as e:
        print(f"Error: {e}")
        if hasattr(e, 'read'):
            print(f"Response: {e.read().decode()}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    debug_bookings()
