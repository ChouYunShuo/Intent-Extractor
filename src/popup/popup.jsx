import React from 'react';
import { render } from 'react-dom';
import { MemoryRouter as Router } from 'react-router-dom'
import './popup.css'
import App from './App'


render(<React.StrictMode>
    <Router>
        <App/>
    </Router>
    </React.StrictMode>,
    document.getElementById("react-target"));

    