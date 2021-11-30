import React from "react";

const UserContext = React.createContext ({
    username : '',
    password : '',
    email : '',
    authentificated : false,
    id : '',
    chat_room : '',
    messages: [],    
    setUsername: () => {},
    setPassword: () => {},
    setEmail: () => {},
    setAuthentificated: () => {},
    setId: () => {},
    setChatRoom: () => {},
    setMessages: () => {}
    

}) 

export default UserContext

