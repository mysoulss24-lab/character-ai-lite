import sqlite3
import os

def migrate():
    db_path = os.path.join(os.path.dirname(__file__), 'character_ai_lite.db')
    if not os.path.exists(db_path):
        print("No database found, skipping migration.")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get existing columns in characters table
    cursor.execute("PRAGMA table_info(characters)")
    columns = [info[1] for info in cursor.fetchall()]
    
    if "user_description" not in columns:
        print("Adding user_description to characters table...")
        cursor.execute("ALTER TABLE characters ADD COLUMN user_description TEXT DEFAULT ''")
        
    if "additional_characters" not in columns:
        print("Adding additional_characters to characters table...")
        # Since it will be JSON, TEXT is fine for sqlite
        cursor.execute("ALTER TABLE characters ADD COLUMN additional_characters TEXT DEFAULT '[]'")
        
    # Get existing columns in chats table
    cursor.execute("PRAGMA table_info(chats)")
    chat_columns = [info[1] for info in cursor.fetchall()]
    
    if "is_saved" not in chat_columns:
        print("Adding is_saved to chats table...")
        # Boolean in sqlite is typically INTEGER (0 or 1). Default to 0 (False) for temporary chats.
        cursor.execute("ALTER TABLE chats ADD COLUMN is_saved BOOLEAN DEFAULT 0")

    conn.commit()
    conn.close()
    print("Migration completed.")

if __name__ == "__main__":
    migrate()
