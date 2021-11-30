import React from 'react'
import { Link } from 'react-router-dom';
import '../../styleCommun.css'
import './HomePage.css'


function Homepage() {
  return (
    <div className="">
      <div className="imgLogo">
      <Link className="linklogo" to='/'> <img src='logoBlablaTech.png' alt='logo' /></Link>
      </div>
      <div className="main mainHomePage" style={{ backgroundImage: "url(Vector.png)", backgroundRepeat: "no-repeat" }}>
        <h1 className="titreApp">chat app & message</h1>
        <div className="divBtn" >
          <button><Link to='/login' className='BtnLink col-md-3'>Se connecter</Link></button>
          <button><Link to='/register' className='BtnLink col-md-3'>Créer un compte</Link></button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;