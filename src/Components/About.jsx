import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/About.css';


function About() {
  return (
    <div>
      <section className='Hero'>
      
      <div className='Link'>
        <div className='Item'>
       <Link to="/"    > Home</Link> /About
       </div>
       </div>
      </section>
      <section>
      
    <div className='Content'>
      <h1 >About Secure Ledger </h1>

      <section>
        <h2>Overview</h2>
        <p>
          Welcome to Project Name, a cutting-edge initiative at the intersection of decentralized storage, blockchain technology, and smart contract development. Our project is driven by the vision of ensuring continuous data integrity in a decentralized storage environment.
        </p>
      </section>

      <section>
        <h2>Mission</h2>
        <p>
          Our mission is to provide a robust and secure solution for verifying the integrity of stored data over time, leveraging the power of blockchain and smart contracts. By combining innovative technologies, we aim to optimize communication and computation resources, offering a reliable and decentralized approach to data integrity.
        </p>
      </section>

      <section>
        <h2>Key Features</h2>
        <ul>
          <li><strong>Continuous Data Integrity Checking:</strong> Our system is designed to perform continuous data integrity checks, ensuring that stored data remains secure and unaltered.</li>
          <li><strong>Blockchain-Powered Verification:</strong> Utilizing blockchain technology, we employ smart contracts to manage data integrity checks, offering a transparent and tamper-resistant verification process.</li>
          <li><strong>Decentralized Storage:</strong> We leverage decentralized storage solutions, such as IPFS, to enhance data security and availability while minimizing reliance on central servers.</li>
          <li><strong>User-Friendly Interface:</strong> Our user interface is crafted for simplicity and efficiency, allowing users to easily initiate data integrity checks and view verification results.</li>
        </ul>
      </section>

      <section>
        <h2>How It Works</h2>
        <ol>
          <li><strong>Upload Your Data:</strong> Users can securely upload their data to our decentralized storage, where it is distributed across a network of nodes.</li>
          <li><strong>Blockchain Verification:</strong> Our smart contract offers the possiblitie to verify the integrity of the stored data, performing verifications on the blockchain to ensure its integrity.</li>
          <li><strong>Real-Time Results:</strong> Users receive real-time results through our intuitive interface, providing transparency and confidence in the security of their stored information.</li>
        </ol>
      </section>

      <section>
        <h2>Get Involved</h2>
        <p>
          Secure Ledger is an open-source project, and we welcome contributions from the community. Whether you're a developer, designer, or blockchain enthusiast, there are various ways to get involved. Check out our GitHub repository for more information on how you can contribute to the project.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          Have questions, suggestions, or just want to connect? Reach out to us at beguareyahya@gmail.com. We value your feedback and are excited to have you on board as we shape the future of decentralized storage and data integrity.
        </p>
      </section>

      <section>
        <h2>Join Us</h2>
        <p>
          Join us on this journey towards a more secure and decentralized digital landscape!
        </p>
      </section>

      <p>Secure Ledger Team</p>
    </div>
      </section>
    </div>
  )
}

export default About;