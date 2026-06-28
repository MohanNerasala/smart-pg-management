import psycopg2

PG_URL = "postgresql://postgres:Chakri%40**0987@db.ybvpmydjqtdoiehlidwj.supabase.co:5432/postgres"

def reset_tables():
    print("Connecting to Supabase PostgreSQL...")
    conn = psycopg2.connect(PG_URL)
    cursor = conn.cursor()

    try:
        # We use TRUNCATE with CASCADE to automatically delete dependent rows 
        # (like refresh tokens and bookings) when users are deleted.
        # But to be safe, we list them explicitly.
        print("Clearing bookings, refresh tokens, and users...")
        
        # TRUNCATE removes all rows quickly
        cursor.execute('TRUNCATE TABLE "bookings" CASCADE;')
        print("Bookings cleared.")
        
        cursor.execute('TRUNCATE TABLE "refreshtoken" CASCADE;')
        print("Refresh tokens cleared (all users logged out).")
        
        cursor.execute('TRUNCATE TABLE "users" CASCADE;')
        print("Users cleared.")
        
        conn.commit()
        print("\nSuccess! Your PGs, floors, and rooms have been KEPT. You are ready to create new users and start fresh bookings.")

    except Exception as e:
        conn.rollback()
        print(f"Error resetting tables: {e}")

    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    reset_tables()
