import React from 'react'
import '../../styleCommun.css'
import UserContext from '../user_context/user_context';
import './Login.css'
import {Link} from "react-router-dom"


class Login extends React.Component {
  static contextType = UserContext // Définit un contextType pour lire le contexte de thème actuel. 
  //  React va trouver le Provider de thème ancêtre le plus proche et utiliser sa valeur.
  // (utilisé dans onSubmitClick pour mettre a jour contexte)
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      authentificated: false,
      id: ''              
    };
  }


  handleChangeUsername = (e) => {
    this.setState({ username: e.target.value })

  }
  handleChangePassword = (e) => {
    this.setState({ password: e.target.value })

  }



  onSubmitClick = () => {
    let user = {
      username: this.state.username,
      password: this.state.password
    }
  
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json()
      })
      .then(data => {
        if (data && data.authentificated) {
          // console.log("data auth", data.authentificated)
          localStorage.setItem('user-info',JSON.stringify(user))
          this.setState({ authentificated: data.authentificated })
          this.setState({id: data.id})
          // Update username in context with setUsername, setPassword, setAuthenficated() method :
          let value = this.context
          value.setUsername(this.state.username)
          value.setPassword(this.state.password)
          value.setAuthentificated(this.state.authentificated)
          value.setId(this.state.id)
          this.props.history.push('/conversation-container') 
        }
        // console.log("I am the id in login",this.state.id)
      })
      .catch(error => console.log(error))
  }

  render() {

    return (
        <UserContext.Consumer>
          {({ username, password, setUsername, setPassword }) => (
          <div >
        <div className="imgLogo imgLogoInLogin">
          <Link className="linklogo" to='/'><img src='logoBlablaTech.png' alt='logo' /></Link>
        </div>
        <div className="main maimLogin" style={{ backgroundImage: "url(Vector.png)", backgroundRepeat: "no-repeat" }}>
          <h2 className="titreLogin">Se connecter</h2>
          <form className=" pt-4 g-3 d-flex flex-column p-3 text-start" >
            <div className="col-md-3 m-auto mb-3">
              <label htmlFor="validationDefault01" className="form-label ">Identifiant</label>
              <input type="text" className="form-control mr-3" id="validationDefault01"
                onChange={this.handleChangeUsername} required />
            </div>
            <div className="col-md-3  m-auto">
              <label htmlFor="validationDefault02" className="form-label">Mot de passe</label>
              <input type="password" className="form-control" id="validationDefault02"
                onChange={this.handleChangePassword} required />
            </div>
            <div className="divBtn col-md-3 mt-3 ">
              <button type="button" onClick={() =>this.onSubmitClick()} >Se connecter</button>
            </div>
          </form>
          <Link className='baliseLink' to='/register'>Créer un compte</Link>
        </div> 
    </div>
    )}
        </UserContext.Consumer>
     
    );
  }
}

export default Login;