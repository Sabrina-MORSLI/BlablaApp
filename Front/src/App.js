import React from 'react'
import './App.css';
import Homepage from './components/homepage/HomePage';
import Login from './components/login/Login.js'
import Register from './components/register/Register.js'
import { BrowserRouter, Route } from "react-router-dom";
import UserContext from './components/user_context/user_context';
import ConversationContainer from './components/conversationContainer/ConversationContainer';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.setUsername = (username) => {
      this.setState({ username: username })
    }
    this.setPassword = (password) => {
      this.setState({ password: password })
    }
    this.setAuthentificated = (authentificated) => {
      this.setState({ authentificated: authentificated })
    }
    this.setId = (id) => {
      this.setState({id: id})    
    }
    this.setChatRoom = (chat_room) => {
      this.setState({chat_room: chat_room})
    }
    this.setMessages = (messages) => {
      this.setState({ messages: messages })
    }

    this.state = {
      username: '',
      password: '',
      id: '',
      chat_room: '',
      authentificated: false,
      messages: [],      
      setUsername: this.setUsername,
      setPassword: this.setPassword,
      setAuthentificated: this.setAuthentificated,
      setId: this.setId,
      setChatRoom: this.setChatRoom
    };
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        <BrowserRouter>            
            <Route path='/' component={Homepage} exact />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/conversation-container/' id={this.state.id} component={ConversationContainer} />           
        </BrowserRouter>
      </UserContext.Provider>
    );
  }
}

export default App;
