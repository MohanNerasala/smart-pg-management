import psycopg2
import os

# Configuration from application.yml defaults
DB_URL = os.environ.get("SPRING_DATASOURCE_URL", "jdbc:postgresql://localhost:5432/pg_management")
DB_USER = os.environ.get("SPRING_DATASOURCE_USERNAME", "postgres")
DB_PASSWORD = os.environ.get("SPRING_DATASOURCE_PASSWORD", "irkahc**0987")

def test_connection():
    # JDBC URL to standard PostgreSQL connection string
    # jdbc:postgresql://localhost:5432/pg_management -> host=localhost port=5432 dbname=pg_management
    try:
        if DB_URL.startswith("jdbc:postgresql://"):
            conn_part = DB_URL[len("jdbc:postgresql://"):]
            host_port, db_name = conn_part.split("/")
            if ":" in host_port:
                host, port = host_port.split(":")
            else:
                host, port = host_port, "5432"
        else:
            print(f"Unknown URL format: {DB_URL}")
            return

        print(f"Attempting to connect to {host}:{port}/{db_name} as {DB_USER}...")
        
        conn = psycopg2.connect(
            host=host,
            port=port,
            database=db_name,
            user=DB_USER,
            password=DB_PASSWORD,
            connect_timeout=5
        )
        print("✅ SUCCESS: Connection to PostgreSQL verified!")
        conn.close()
    except Exception as e:
        print(f"❌ FAILURE: {str(e)}")
        print("\nPossible Issues:")
        print("1. Your Supabase instance is NOT running locally.")
        print("2. The port (5432) is incorrect. Check 'supabase status'.")
        print("3. Your firewall or Docker settings are blocking the connection.")

if __name__ == "__main__":
    test_connection()
