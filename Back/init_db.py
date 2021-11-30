import sqlite3
import hashlib
from datetime import datetime
import os
from pathlib import Path

DIR = Path(__file__).resolve().parent
DATABASE = "chatApp.db"
db = sqlite3.connect(os.path.join(DIR, DATABASE))

cursor = db.cursor()

cursor.execute("DROP TABLE IF EXISTS message")
cursor.execute("DROP TABLE IF EXISTS user_conversation")
cursor.execute("DROP TABLE IF EXISTS conversation")
cursor.execute("DROP TABLE IF EXISTS user")
cursor.execute("DROP TABLE IF EXISTS rgpd")

cursor.execute("""CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                            username VARCHAR(200) UNIQUE NOT NULL,
                            email TEXT UNIQUE NOT NULL,
                            password TEXT NOT NULL)""")

cursor.execute("""CREATE TABLE conversation (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                            name VARCHAR(200),
                            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)""")

cursor.execute("""CREATE TABLE user_conversation (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                            id_user INTEGER REFERENCES user(id) NOT NULL,
                            id_conversation INTEGER NOT NULL REFERENCES conversation(id))""")

cursor.execute("""CREATE TABLE message (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                            id_user INTEGER REFERENCES user(id) NOT NULL,
                            id_conversation INTEGER REFERENCES conversation(id) NOT NULL,
                            content TEXT NOT NULL,
                            message_timestamp  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)""")

cursor.execute("""CREATE TABLE rgpd (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                            id_user INTEGER REFERENCES user(id) NOT NULL,
                            consentment BOOLEAN UNIQUE NOT NULL,
                            consentment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)""")

# ------------------- PARTIE INSERT DE TESTS --------------------
# -- A RETIRER AVANT L'UTILISATION FINALE DE VOTRE APPLICATION --

for nom in ['Juan', 'Michel', 'Damien']:
    cursor.execute("""  INSERT INTO user (username, email, password)
                        VALUES (?, ?, ?)""", (nom, nom+"@blablapp.com",hashlib.sha256("bonjour".encode()).hexdigest()))

for e in ['La famille', 'Conv-poto', 'Petit-chat']:
    cursor.execute("""  INSERT INTO conversation (name)
                        VALUES (?)""", [e])

n = 1
msg = ['Salut', 'Ça va?']
for i in range(1, 4):
    for j in range(1, 4):
        if n%5!=1:
            cursor.execute("""  INSERT INTO user_conversation (id_user, id_conversation)
                                    VALUES (?, ?)""", (i, j))
        
            cursor.execute("""  INSERT INTO message (id_user, id_conversation, content)
                            VALUES (?, ?, ?)""", (i, j, msg[i%2]))
        n += 1
# --------------------- FIN PARTIE INSERTS ---------------------




db.commit()
db.close()
