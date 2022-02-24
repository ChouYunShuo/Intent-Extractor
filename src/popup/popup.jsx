import React from 'react';
import { render } from 'react-dom';
import './popup.css'
import App from './App'


render(<React.StrictMode>
    <App/>
    </React.StrictMode>,
    document.getElementById("react-target"));