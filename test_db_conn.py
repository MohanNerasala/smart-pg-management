import mysql.connector
from mysql.connector import Error

def check_db():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='chakri'
        )
        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute("SHOW DATABASES")
            databases = [db[0] for db in cursor.fetchall()]
            print("Connected successfully!")
            print("Existing databases:", databases)
            
            if 'staynest_db' in databases:
                print("Found staynest_db!")
            elif 'pg_management' in databases:
                print("Found pg_management!")
            else:
                print("Neither staynest_db nor pg_management found. Please run db_schema.sql")
                
            cursor.close()
            connection.close()
    except Error as e:
        print(f"Error connecting to MySQL: {e}")

if __name__ == "__main__":
    check_db()
