import React from 'react';
import { render } from 'react-dom';
import './foreground.css'
import ForeApp from './ForeApp'



render(<React.StrictMode>
    <ForeApp/>
</React.StrictMode>,
document.getElementById("react-foreground"));