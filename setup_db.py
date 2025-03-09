import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    place TEXT NOT NULL,
    fare INTEGER NOT NULL,
    total_fare INTEGER DEFAULT 0,
    image TEXT NOT NULL
)
""")

conn.commit()
conn.close()
print("Database setup complete!")
