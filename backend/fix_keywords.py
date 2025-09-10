import os
import psycopg2
import json
from dotenv import load_dotenv

# Load .env (make sure DATABASE_URL is there)
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def fix_keywords():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # Select rows where keywords is not a proper JSON array
    cur.execute("SELECT id, keywords FROM posts;")
    rows = cur.fetchall()

    fixed = 0
    for post_id, keywords in rows:
        if isinstance(keywords, str):  # stored as plain text
            cleaned = [kw.strip() for kw in keywords.replace('"','').split(",") if kw.strip()]
            cur.execute(
                "UPDATE posts SET keywords = %s WHERE id = %s",
                (json.dumps(cleaned), post_id)
            )
            fixed += 1

    conn.commit()
    cur.close()
    conn.close()
    print(f"✅ Fixed {fixed} posts")

if __name__ == "__main__":
    fix_keywords()
