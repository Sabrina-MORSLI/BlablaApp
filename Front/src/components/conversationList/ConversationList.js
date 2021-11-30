import React from "react"
import './ConversationList.css'
import UserContext from '../user_context/user_context';
import '../../styleCommun.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateConversation from "../newConversation/CreateConversation";


class ConversationList extends React.Component {
    static contextType = UserContext 
    constructor(props) {
        super(props);
        this.state = {           
            ListOfConv: [],
            historiqueOfConv : [],
            chat_room: '',
            currentConv: '',
            id:''                                                
        };          
             
}


handleChangeChatRoom = (conversationId, conversationName) => {
    this.setState({chat_room: conversationId})
    let value = this.context
        value.setChatRoom(this.state.chat_room)
    this.setState({currentConv: conversationName})     
    this.ConversationHistorique()
}



getConversation = () => {        
    
    let value = this.context
    let user = {
        username: value.username,
        password: value.password
      }
    
        
    fetch('http://localhost:5000/conversation-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
      
      
    }
    )
    .then(response => {
      if(!response.ok) {
          throw new Error("HTTP error " + response.status);
      } 
      return response.json()})
    .then(data => {        
        this.setState({ListOfConv: data})        
        
    })
    
    .catch(error => console.log(error))
}


   
    ConversationHistorique = () => {
                
         
        fetch("http://localhost:5000/conversation/"+ this.state.chat_room, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.user)
        })
        .then(response => {
        if(!response.ok) {
            throw new Error("HTTP error " + response.status);
        } 
        return response.json()})
        .then(data => {
            
            this.setState({historiqueOfConv: data})
            // console.log("historique de conversation", data)
            this.state.historiqueOfConv.map((item) => {
                return (
                this.setState({id: item[3]})
                
                )
                
            })
            
           
        })
  
        .catch(error => console.log(error)) 
  
        }
    componentDidMount = () => {
        this.getConversation();              
        };
    
    render () {

    return (
        <>
       
       <div>
      
              <div className="chat">
                 
                <div id="plist" className="people-list">
                   
                <button type="button" className="btn btn-new-group" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                <i className="fa fa-user-plus iconModal"></i>Créer un groupe
                                </button>
                                                           
                    
                    <div className="ListScroll">
                    {this.state.ListOfConv.map((conv, index) => {
                    return (
                        <ul className="list-unstyled chat-list mt-2 mb-0">
                            <li className="clearfix">
                                
                                <div className="about">
                                    <div className="name" key={index} onClick={()=>this.handleChangeChatRoom(conv[0], conv[1])}><i className="fa fa-user iconColor"></i>  {conv[1]}</div>                           
                                </div>
                                
                            </li>                
                        </ul>     
                        )
                    })}
                    </div>
                </div>

            
                <div className="chat-header clearfix">
                    <div className="row">
                        <div className="col-lg-6">                   
                           
                        
                            <div className="chat-about">
                                <h5 className="m-b-0"><i className="fa fa-user iconColor"></i>  {this.state.currentConv}</h5>                            
                            </div>
                            
                            
                        </div>                        
                    </div>
                </div>
                
                <div className="chat-history bddChatHistory ListScroll">                                
                    {this.state.historiqueOfConv.map((histConv, index) => {                        
                                                                                      
                            return (                                                                              
                                <ul className="m-b-0">
                                    <li className="clearfix">
                                        
                                        <div className="message-data">                                
                                            <span className="message-data-time" key={index}><i className="fa fa-user iconColor"></i>  {histConv[0]}  </span> {/* {histConv[2]} */}
                                            
                                        </div>                                                                                                              
                                            <div className="message other-message" key={index}>{histConv[1]}
                                        </div>
                                                                               
                                    </li>
                                </ul>
                            )
                         
                        
                    })}                    
                </div>               
            
        </div>
        </div>
       
         <CreateConversation />
                            
        </> 
    )           
 }
}

 export default ConversationList

  