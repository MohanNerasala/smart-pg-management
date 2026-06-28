import pymysql
import psycopg2
from psycopg2.extras import execute_values
import urllib.parse

# Database configurations
MYSQL_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'chakri',
    'database': 'pg_management'
}

PG_URL = "postgresql://postgres:Chakri%40**0987@db.ybvpmydjqtdoiehlidwj.supabase.co:5432/postgres"

# The order matters because of Foreign Keys
TABLES = [
    'users',
    'pg',
    'floors',
    'rooms',
    'bookings',
    'refreshtoken'
]

def migrate():
    print("Connecting to MySQL...")
    mysql_conn = pymysql.connect(
        host=MYSQL_CONFIG['host'],
        user=MYSQL_CONFIG['user'],
        password=MYSQL_CONFIG['password'],
        database=MYSQL_CONFIG['database'],
        cursorclass=pymysql.cursors.DictCursor
    )
    
    print("Connecting to Supabase PostgreSQL...")
    pg_conn = psycopg2.connect(PG_URL)
    pg_cursor = pg_conn.cursor()

    try:
        for table in TABLES:
            print(f"\n--- Migrating {table} ---")
            
            # Fetch from MySQL
            with mysql_conn.cursor() as my_cursor:
                my_cursor.execute(f"SELECT * FROM {table}")
                rows = my_cursor.fetchall()
                
            if not rows:
                print(f"No data in {table}, skipping.")
                continue
                
            columns = list(rows[0].keys())
            
            # Construct insert query
            # We map MySQL columns exactly to Postgres
            cols_str = ', '.join([f'"{c}"' for c in columns])
            
            # Use execute_values for batch insert
            insert_query = f"INSERT INTO public.\"{table}\" ({cols_str}) VALUES %s"
            
            # Prepare data
            data_tuples = [tuple(row[col] for col in columns) for row in rows]
            
            print(f"Inserting {len(data_tuples)} rows into {table}...")
            # We use ON CONFLICT DO NOTHING just in case some data was already inserted
            # Actually, doing standard insert is better to catch errors.
            try:
                execute_values(pg_cursor, insert_query, data_tuples)
                pg_conn.commit()
                print(f"Successfully migrated {table}!")
            except Exception as e:
                pg_conn.rollback()
                print(f"Error inserting into {table}: {e}")
                
            # Reset PostgreSQL Sequence for auto-increment ID columns
            # Assuming 'id' is the primary key for all tables.
            try:
                # If there is an 'id' column, update its sequence so new inserts don't fail
                if 'id' in columns or 'ID' in columns:
                    id_col = 'id' if 'id' in columns else 'ID'
                    seq_query = f"SELECT setval(pg_get_serial_sequence('\"{table}\"', '{id_col}'), coalesce(max(\"{id_col}\"),0) + 1, false) FROM \"{table}\";"
                    pg_cursor.execute(seq_query)
                    pg_conn.commit()
                    print(f"Updated sequence for {table}")
            except Exception as e:
                pg_conn.rollback()
                print(f"Could not update sequence for {table} (might not have an auto-increment ID): {e}")

    finally:
        mysql_conn.close()
        pg_cursor.close()
        pg_conn.close()
        print("\nMigration finished!")

if __name__ == '__main__':
    migrate()
