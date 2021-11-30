######
Date : 2021-6-22
Projet : BlablApp

#####



#####
Commandes à lancer à la première installation

cd BlablApp
cd Back

##### Environnement Virtuel
>>> Dans le répertoire : BlablApp/Back (Back sur flask)

# Installation de virtualenv :
pip3 install virtualenv
# Création de l'environnement virtuel env :
virtualenv -p python3 virt-env
# Activation de virt-env :
source virt-env/bin/activate
résultat ==> (virt-env) BlablApp

# désactivation de virt-env :
deactivate
résultat ==> BlablApp

###### Prérequis à installer avant la première utilisation :

## Dans le répertoire : BlablApp/Back

pip3 install -r requirements.txt

>>> Lancer le Back

python3 init_db.py (ou lancer directement le "Run")
python3 main.py (ou lancer directement le "Run")

###### Installer Socket io dans le back
## Dans le répertoire : BlablApp/Back

pip install flask-socketio
pip install simple-websocket

## Dans le répertoire : BlablApp/Front (ReactApp)

>>> Installer Socket io dans le Front

npm i socket.io-client@2.3.1
npm i socket.io express cors colors

>>> Lancer la react app 

npm install
npm start 
