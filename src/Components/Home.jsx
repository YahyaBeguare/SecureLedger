import React from 'react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div >
      <div className='Img'>
      .
      </div>
      
      <div className='Home' >
            <div>
              <h1>Welcome to Our Project</h1>
              <p className='span'>Explore our services on the Service Page.</p>
              <p className='span'>Get started and experience the benefits of our project.</p>
              <p className='span'>Feel free to navigate and discover what we have to offer.</p>
            </div>

            <div>
              <h2>Ready to Get Started?</h2>
              <p>Visit our Service Page to unlock the full potential of our project.</p>
              <Link to="/service">
                <button>Explore Services</button>
              </Link>
              <Link to="https://www.linkedin.com/in/beguare-yahya/">
              <p className='author'>© Secure Ledger by YAHYA BEGUARE</p>
              </Link>
            </div>
      </div>
    </div>
  )
}

export default Home;