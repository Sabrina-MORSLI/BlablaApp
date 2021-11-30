import React from "react";
import './Register.css';
import '../../styleCommun.css'
import {Link} from 'react-router-dom'


class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      confirmPassword: ''
    };
  }

  onSubmitClick = (e) => {
    e.preventDefault()
    
    let user = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email
    }
   

    fetch('http://localhost:5000/register', {
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
        
        if (data && data.registered) {
          this.props.history.push('/login')
         
        }
      })
      .catch(error => console.log(error))

  }

  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value })
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value })
  }

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value })
  }

  handleConfirmPassword = (e) => {
    this.setState({ confirmPassword: e.target.value })
  }
  render() {
    return (
      <div>
         <div className="imgLogo imgLogoInLogin">
         <Link className="linklogo" to='/'><img src='logoBlablaTech.png' alt='logo' /></Link>
        </div>
        <div className="main pb-2" style={{ backgroundImage: "url(Vector.png)", backgroundRepeat: "no-repeat" }}>
        <h2 className='titreRegister'>créer un compte</h2>
        <form className=" pt-4 g-3 d-flex flex-column p-3 text-start">
          <div className="col-md-3 m-auto mb-3">
            <label for="exampleInputEmail1" className="form-label">Identifiant</label>
            <input type="text" className="form-control"
              onChange={this.handleUsernameChange}
              value={this.username} aria-describedby="emailHelp" />
          </div>
          <div className="col-md-3 m-auto mb-3">
            <label for="exampleInputEmail1" className="form-label">Adresse email</label>
            <input type="email" className="form-control"
              onChange={this.handleEmailChange}
              value={this.email} id="exampleInputEmail1" />
          </div>
          <div className="col-md-3 m-auto mb-3">
            <label for="exampleInputPassword1" className="form-label">Mot de passe</label>
            <input type="password" className="form-control"
              onChange={this.handlePasswordChange}
              value={this.password} id="exampleInputPassword1" required/>
          </div>
          <div className="col-md-3 m-auto mb-3">
            <label for="exampleInputPassword1" className="form-label">Confirmation de passe</label>
            <input type="password" className="form-control"
              onChange={this.handleConfirmPassword}
              value={this.confirmPassword} id="exampleInputPassword2" required/>
          </div>
          <div className='col-md-3 mt-3 m-auto'>
            <div className="form-check d-flex ">
              <input className="form-check-input p-2" type="checkbox" value="" id="invalidCheck2" required />
              <label className="form-check-label ps-2" for="invalidCheck2"> Accepter nos conditions d'utilisation de vos données <a href>savoir plus</a>
              </label>
            </div>
          </div>
          <div className="divBtn col-md-3 mt-3 ">
          <button onClick={this.onSubmitClick} type="button" >Créer un compte</button>
          </div>
        </form>
        <Link className='baliseLink' to='/login'>Se connecter</Link>
        </div>
      </div>
    )
  }

}

export default Register
