import sqlite3

# Connect to SQLite database
conn = sqlite3.connect("bus_fare.db")
cursor = conn.cursor()

# Create users table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    admission_number TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    place TEXT NOT NULL,
    branch TEXT NOT NULL,
    semester TEXT NOT NULL,
    fixed_fare INTEGER NOT NULL,
    total_fare INTEGER DEFAULT 0
)
""")

conn.commit()
conn.close()
