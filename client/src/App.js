// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        // This line calls your new backend endpoint
        const response = await axios.get('http://localhost:5000/api/resumes');
        setResumes(response.data);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };

    fetchResumes();
  }, []);

  const handleBuyNow = (resumeId) => {
    console.log('Buying resume with ID:', resumeId);
    // We will add the Stripe payment logic here next
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Resume Marketplace</h1>
        <p>Find the perfect resume template for your next career move.</p>
      </header>
      <main className="resume-grid">
        {resumes.map((resume) => (
          <div key={resume._id} className="resume-card">
            <h2 className="resume-title">{resume.title}</h2>
            <p className="resume-description">{resume.description}</p>
            <div className="card-footer">
              <p className="resume-price">${(resume.priceInCents / 100).toFixed(2)}</p>
              <button className="buy-button" onClick={() => handleBuyNow(resume._id)}>
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;