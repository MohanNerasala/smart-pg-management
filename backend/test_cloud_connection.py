import psycopg2
import sys

# Test the IPv4 Pooler Connection
conn_str = "postgres://postgres.dablrwdnybxqofefxtim:irkahchakri0987@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"

print("--- Supabase Cloud Connection Diagnostics ---")
print(f"Testing URL: {conn_str.split('@')[1]}")

try:
    conn = psycopg2.connect(conn_str)
    print("✅ SUCCESS: Connection successful from your computer to Supabase! 🥂🏁")
    conn.close()
except Exception as e:
    print(f"❌ ERROR: Connection failed from your computer. Reason: {e}")
    if "Network is unreachable" in str(e):
        print("🔍 TIP: Your local network or firewall is blocking the cloud server. Checking port 5432...")
    elif "password authentication failed" in str(e):
        print("🔍 TIP: The password 'irkahchakri0987' might be incorrect or have hidden characters.")
    
    # Try Transaction Mode (6543)
    print("\n--- Testing Port 6543 (Transaction Mode) ---")
    try:
        conn_str_6543 = "postgres://postgres.dablrwdnybxqofefxtim:irkahchakri0987@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
        conn = psycopg2.connect(conn_str_6543)
        print("✅ SUCCESS: Connection successful on port 6543! 🥂")
        conn.close()
    except Exception as e2:
        print(f"❌ ERROR: Also failed on port 6543. Reason: {e2}")
