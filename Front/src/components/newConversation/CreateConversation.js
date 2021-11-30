import React from 'react'
import '../../styleCommun.css'
import './CreateConversation.css'
import UserContext from '../user_context/user_context';



class CreateConversation extends React.Component {
  static contextType = UserContext
  constructor(props) {
    super(props);
    this.state = {
      userConected: { user: JSON.parse(localStorage.getItem('user-info')) },
      conversation_name: '',
      all_user: [],
      email: ''
    }
  }

  componentDidMount() {
    // this.NewConversation()
    this.getAllUser()
  }


  // Fonction qui récupère le nom de la nouvelle groupe
  handelChangeGroupName = (e) =>{
    this.setState({conversation_name: e.target.value })
  }


  
  // Fonction qui récupère tous les users dans le BDD
  getAllUser = () => {
    let user = {
      username: this.state.userConected.user.username,
      password: this.state.userConected.user.password,
    }
    fetch('http://localhost:5000/all_user', {
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
      
      .then(data => this.setState({ all_user: data }))

      .catch(error => console.log(error))
  }




  NewConversation = () => {
    let user = {
      username: this.state.userConected.user.username,
      password: this.state.userConected.user.password,
    }
    let myData = {
      conversation_name: this.state.conversation_name,
      email: this.state.email.split(" ")
    //   email: ["bina@gmail.com", "jamal@hotmail.com"]
    }


    fetch('http://localhost:5000/create-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: (JSON.stringify(user), JSON.stringify(myData))

    })
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json()
      })
      .then(data => {
        // console.log('je suis data de ceate conversation', data)
      })
      .catch(error => console.log(error))
  }

  render() {
    
    return (

      <div className="modal fade " id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header entete-modal">
              <h5 className="modal-title" id="staticBackdropLabel">Créer un nouveau groupe</h5>
              <button type="button" className=" btn-close-modal " data-bs-dismiss="modal" aria-label="Close"><i className="fa fa-times icon-close"></i></button>
            </div>
            <div className="modal-body main-modal">
              <div className='divSearch m-auto w-75 p-2'>
                <input className='inputSearch' id='inputSearchId' placeholder='Chercher un amis'
                />
                <span className="loupe">&#128269;</span>
              </div>

              <div className="d-flex m-auto mb-4 mt-4">
                <label htmlFor="validationDefault02" className="form-label mx-3">Nom de groupe : </label>
                <input type="text" className="form-control w-50 " id="validationDefault02"
                 onChange={this.handelChangeGroupName} 
                 value={this.state.conversation_name}
                  required />
              </div>
              {this.state.all_user.map((user, index) => {
                return (
                  <ul className="">
                    <li className="d-flex  justify-content-between mt-4">
                      <div className="d-flex align-items-end">                        
                          <div className="name" key={index}><i className="fa fa-user iconUserModal"></i> {user[1]}</div>                
                       
                      </div>
                      <input className="form-check-input inputCheckbox" type="checkbox" id="checkboxNoLabel" 
                      value="" aria-label="..." onClick={e => this.setState({email: this.state.email + ' ' + user[2]})}/>
                    </li>
                  </ul>
                )
              })}
            </div>
            <div className="modal-footer footer-modal">
              <button type="button" className="btn bg-danger text-white" data-bs-dismiss="modal">Fermer</button>
              <button type="button" className="btn btn-new-group" >Créer un groupe</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default CreateConversation;