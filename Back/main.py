from flask import Flask, render_template, g, jsonify, session, request
from flask_socketio import SocketIO, send
import sqlite3
import os
import hashlib
from pathlib import Path
from flask_cors import CORS, cross_origin


DIR = Path(__file__).resolve().parent
DATABASE = os.path.join(DIR, "chatApp.db")
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'blabla'
socketio = SocketIO(app, cors_allowed_origins="*") 

def get_db(): # connecte l'application à la base de données sqlite3
    db = getattr (g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

session = {"id": '', "username": '', "password": '', "room": ''}

@app.route("/")
@cross_origin(supports_credentials=True)
def index():    
    return ("Welcome to BlablaTech")

   

# /login : connecte un utilisateur à partir d'un username et password
# renvoie dico json { logged_in : true} si OK, { logged_in :false} sinon
@app.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    
    postdata = request.get_json() 
   
    if postdata.get('username') and postdata.get('password'):
        username = postdata.get('username')
        session["username"]= username
        password = hashlib.sha256(postdata.get('password').encode()).hexdigest()
        session["password"]= password
        db = get_db()
        cursor = db.execute("SELECT id FROM user WHERE username = (?) and password = (?)", (username, password))
        res = cursor.fetchone()
        if res:
            session['user'] = res[0]
            return {"authentificated" : True, "id": res[0]}
    return '{"authentificated" : false}'.headers.add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth")


# déconnecte l'utilisateur
# en cas de succès, renvoie un dictionnaire {disconnected : true}
# en cas d'échec, renvoie un dictionnaire {disconnected : false}
@app.route("/logout")
@cross_origin(supports_credentials=True)
def logout():
    
    if session.get('user'):
       
        for key in list(session.keys()):
            session.pop(key)
        return '{"disconnected" : true}'
    return '{"disconnected" : false}'



# inscrit un utilisateur dans la base de données, requiert le username, email et password
# si l'enregistrement marche : renvoie un dictionnaire (json) { registered :true} et connecte l’utilisateur
# si l'enregistrement ne marche pas : renvoie un dictionnaire (json) {registered : false}
@app.route('/register', methods=['POST'])
@cross_origin(supports_credentials=True)
def register(): 
    postdata = request.get_json()
    
    if not session.get('user') and postdata:
        if postdata.get('username') and postdata.get('password') and postdata.get('email'):
            username = postdata.get('username')            
            email = postdata.get('email')            
            password = postdata.get('password')
          
        db = get_db()
        cursor = db.cursor()
        cursor = db.execute("SELECT id FROM user WHERE username = (?)", (username,))
        existing_username = cursor.fetchone()
        cursor = db.execute("SELECT id FROM user WHERE email = (?)", (username,))
        existing_email = cursor.fetchone()
        if not existing_username and not existing_email:
            cursor = db.execute("INSERT INTO user(username, email, password) VALUES (?, ?, ?)", (username, email, hashlib.sha256(password.encode()).hexdigest()))
            # cursor = db.execute("INSERT INTO rgpd(username) VALUES (?)", (username))
            db.commit()
            return '{"registered" : true}'
    return '{"registered" : false}'


    # renvoie la liste des conversations à laquelle un user participe
    # si l'utilisateur a des conversations : renvoie une liste des conversations au format [id, nom, participants]
    # si l'utilisateur n'a pas de conversations : renvoie une liste vide []
@app.route("/conversation-list", methods=['POST', 'GET'])
@cross_origin(supports_credentials=True)
def chatroom_select():
    if session.get('user'):
        user = session.get('user')
        db = get_db()
        cursor = db.cursor()
        cursor = db.execute(""" SELECT conversation.id, conversation.name, GROUP_CONCAT(user.username) AS participants
            FROM user
            LEFT JOIN user_conversation ON user_conversation.id_user = user.id
            LEFT JOIN conversation ON conversation.id = user_conversation.id_conversation
            WHERE conversation.id IN (SELECT conversation.id 
                FROM user, conversation, user_conversation 
                WHERE user.id = user_conversation.id_user
                    AND conversation.id = user_conversation.id_conversation
                    AND id_user = (?))
            GROUP BY conversation.name""", [user])
        res = cursor.fetchall() # contient la liste des id et noms des chatrooms liées à un user, avec la liste des participants
        if res:
            return jsonify(res)
    return jsonify([])

# Route qui récupère les contacts d'un user bien défini
@app.route('/contact', methods=['POST'])
@cross_origin(supports_credentials=True)
def contact():
     if session.get('user'):
        user = session.get('user')
        db = get_db()
        cursor = db.cursor()
        cursor = db.execute("""SELECT id_user, GROUP_CONCAT(id_conversation) As list_conversation_id
                                FROM user_conversation WHERE id_user = 1""")
        return


# Route qui récupère tous les users
@app.route('/all_user',  methods=['POST'])
@cross_origin(supports_credentials=True)
def all_user():
    print('je suis dans all_user', session.get('user'))
    if session.get('user'):        
        db = get_db()
        cursor = db.cursor()
        cursor = db.execute("""SELECT * FROM user """)
        res = cursor.fetchall() # contient la liste des id et noms des chatrooms liées à un user, avec la liste des participants
        print('je suis le res de all user', res)
        if res:
            return jsonify(res)
    return jsonify([])

# crée une conversation à partir de l'email de chaque participant (email) et éventuellement le nom d'une conversation (conversation_name)
# la liste des mails renvoyée renvoie un dictionnaire json contenant l'id de la conversation crée au format : {created_conversation : id }
# si aucun email des emails fournis ne correspond à un utilisateur, renvoie le json suivant {created_conversation : false }
@app.route('/create-conversation', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_conversation():    
    postdata = request.get_json()    
    if session.get('user') and postdata.get('email') and postdata.get('email'):   
        db = get_db()
        cursor = db.cursor()
        user_list = []
        if postdata.get('conversation_name'):
            conversation_name = postdata.get('conversation_name')  
        else:
            conversation_name = "NULL"
            conversation_name = postdata.get('conversation_name')
        
        # récupere tous les user.id et les stocke dans user_list       
        for mail in postdata.get('email'):
            cursor = db.execute(""" SELECT user.id FROM user WHERE user.email = (?)""", [mail])
            res = cursor.fetchone()
            if len(res) > 0: 
                user_list.append( res[0] )

        if len(user_list) > 0:
            if session.get('user') not in user_list:
                user_list.append(session.get('user'))
            cursor = db.execute(""" INSERT INTO conversation (name) VALUES (?)""", [conversation_name])
            conversation_id = cursor.lastrowid
            for user_id in user_list:
                cursor = db.execute(""" INSERT INTO user_conversation (id_user, id_conversation)
                    VALUES (?, ?)""", [user_id, conversation_id])
                db.commit()
            return '{ "created_conversation" : ' + str(conversation_id) + '}'
    return '{ "created_conversation" : false }'


# si la chatroom a des messages : renvoie une liste (json) au format suivant :
# [[username1, message1], [username2, message2], ...]
# si l'utilisateur n'a pas de conversations : renvoie une liste vide []
 # renvoie un dictionnaire des messages pour une chatroom donnée
@app.route('/conversation/<id_conversation>', methods=['POST'])
@cross_origin(supports_credentials=True)
def conversation(id_conversation):    
    if session.get('user'):       
        user = session.get('user')        
        db = get_db()
        cursor = db.cursor()
        cursor = db.execute(""" SELECT
            GROUP_CONCAT(id_conversation)
            FROM user_conversation WHERE user_conversation.id_user = (?)
            AND user_conversation.id_conversation = (?)""", [user, id_conversation])
        res = cursor.fetchall()        
        if res: # vérifie que l'utilisateur fait bien partie de la conversation courante
            cursor = db.execute(""" SELECT
            username, content, message_timestamp, id_user FROM message, user, conversation
            WHERE user.id = message.id_user AND conversation.id = message.id_conversation
            AND conversation.id = (?)""", [id_conversation])
            messages = cursor.fetchall()            
            if not messages:
                messages = []
            session['room'] = id_conversation
            return jsonify(messages)
    return jsonify([])




def message_received():
    print('message was received!!!')
    
@socketio.on('message sent', namespace='/chat')
@cross_origin(supports_credentials=True)
def message_sent(jsonresponse):       
    print("socket io jsonresponse",jsonresponse)
        
    send(jsonresponse, broadcast=True, namespace="/chat")

    if 'message' in jsonresponse.keys() and jsonresponse['message'] != "" and jsonresponse['chat_room']:
               
        db = get_db()
        cursor = db.cursor()
        cursor = db.execute("SELECT id_user FROM user, user_conversation WHERE user.id=(?) AND user_conversation.id_conversation = (?)",
            [jsonresponse['id'], jsonresponse['chat_room']])
        # print("i am the problem", cursor.fetchone()[0])
        id_user = jsonresponse['id']
        print("id_user", id_user)
        
        
        if id_user:           
            print(jsonresponse)
            socketio.emit('message', jsonresponse, callback=message_received, broadcast=True, chat_room=jsonresponse['chat_room'])           
            cursor = db.execute("INSERT INTO message(id_user, id_conversation, content) VALUES (?, ?, ?)", (id_user, jsonresponse['chat_room'], jsonresponse['message']))
            db.commit()            
            # app.logger.info("[sktio.on:message_sent] message written in db");
            return 'Done'          
    
    return 'Not done'
    

if __name__ == '__main__':
    socketio.run(app, debug=True)

