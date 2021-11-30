import React from 'react'
import axios from 'axios';
import UserContext from '../user_context/user_context';
import './Header.css';



class Header extends React.Component {
  static contextType = UserContext
  constructor(props) {
    super(props);
    this.state = {
      userConected: {user : JSON.parse(localStorage.getItem('user-info'))},
    }
  }
;

  logoutFunction = () => {
    axios.get('http://localhost:5000/logout', {
      withCredentials: true
    })
      .then(res => {
        // ici mes instructions sur l'objet response fetché
        if (!res.status === 200) {
          console.log('ici je suis la response', res)
          throw new Error(`erreur HTTP! statut: ${res.status}`);
        }
        else {
          return res.data
        }
      })
      
      .then(data => {
        if (data.disconnected === true) {
          let value = this.context          
          value.setUsername('')
          value.setPassword('')
          value.setAuthentificated(false)
          this.setState({userConected: ''})
          localStorage.clear()
          this.props.history.push('/login')

        }
      })
      .catch(error => console.log('errrrror', error.message))
  }

  render() {
   

    return (
      <UserContext.Consumer>
        {(
          {
            username
          }
        ) => (
          <>
            <nav className="headerNav">
              {this.state.userConected ?
                <div className="NavAfterLogin">
                  <div>{this.state.userConected.user.username || username}</div>
                  <div className='btn-logout' onClick={() => this.logoutFunction()}><i className="fa fa-power-off"></i></div>
                </div>
                :
                null
              }
            </nav>

          </>
        )}
      </UserContext.Consumer>
    );
  }
}
export default Header;


