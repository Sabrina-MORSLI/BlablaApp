import React, { useState, useEffect, useContext } from "react";
import '../homepage/HomePage.css'
import io from "socket.io-client";
import UserContext from '../user_context/user_context'
import '../conversationList/ConversationList.css'
import '../../styleCommun.css'


let socket = io('http://localhost:5000/chat');

const Conversation = () => {
   
    // On récupère la valeur du context
    const contextValue = useContext(UserContext)
    
    // On définit le numéro de la chat_room courante récupérée du context 
    let chat_room = contextValue.chat_room //bonne valeur à récupérer
   
    // On récupère le user du context
    let user = {
        username: contextValue.username,
        password: contextValue.password       
    }
    
    // On récupère l'id du user du context
    let id = contextValue.id
    
    // On initialise une variable message vide pour la mettre à jour 
    // avec le message qu'on écrira dans l'input
    const [message, setMessage] = useState("");

    // Ce premier useEffect va nous permettre de se connecter à socket
    useEffect(() => {
        socket.on('connect', jsonresponse => {            
            // console.log('socket connected')
        })        
    }, [message]);

    // On initialise une liste de messages vides pour lui rajouter 
    // tous les messages que nous allons récupérer
    const [messages, setMessages] = useState([]);

    // Le deuxième useEffect nous permettra d'écouter et de récupérer 
    // le json de messages envoyé depuis le back
    useEffect(() => {      
        socket.on('message', jsonresponse => {                  
            setMessages([...messages, jsonresponse['message']]);    
            // console.log("UEMS | [messages]: " + [messages]);
        })        
     
        return () => {
         
         // close socket connection
        socket.off('message');       
        }}, [messages, messages.length])
   
    
    const handleChange = e => { // écoute l'event
        setMessage(e.target.value); // modifie le state message
        // console.log("onChange | [message] set to : " + [message]);
    };
    const sendmessage = (msg) => {
        // construit le message format json avec 2 champs message et chat_room
        socket.emit("message sent", {message: msg, chat_room: chat_room, user: user, id: id})
        // console.log("sendmessage | message <" + [message] + " > sent!");
        setMessage("");        
       
    }

    return(                     
        <>
        <div className="chat">
        <div className="chat-history ListScroll">           
            { messages.length > 0 &&
            messages.map((message, index) => (
                <ul className="m-b-0">
                    <li className="clearfix">
                        <div className="message-data text-right">                                
                            <span className="message-data-time"> <i className="fa fa-user iconColor"> </i> {contextValue.username} </span>
                            
                        </div>
                        <div className="message other-message" key={index}>  {message}</div>                                                          
                    </li>
                </ul>
                ))
            }
        </div>
        </div>

        <div className="input-group mb-0 fixed-bottom">        
            <input value={message} name="message sent" id="message" type="text" className="form-control" onChange={e => handleChange(e)} 
            placeholder="Enter text here..."></input>
            <div className="input-group-prepend">
                <span onClick={() => sendmessage(message)} className="input_group_text"><i className="fa fa-send iconColor"></i></span>
            </div>                                   
        </div> 
        </>  
    );
}

export default Conversation;
