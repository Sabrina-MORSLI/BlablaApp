import Conversation from "../conversation/Conversation";
import ConversationList from "../conversationList/ConversationList";
import '../conversationList/ConversationList.css'
import Header from '../header/Header';
import {Route} from "react-router-dom"
import '../../styleCommun.css'
import React from "react";

class ConversationContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {           
                                                          
        }; 
    }            

    
    
    
   render () {
    return (
        <>
         <div>
            <Route component={Header}/>
         </div>        
            <div className="container clearfix">
                
                <div className="card chat-app">
                   
                    <ConversationList />                             
                
                    <Conversation />
                    
                </div>
            </div>
           
        </>
    )
}
}

export default ConversationContainer