import React from 'react';

const Header  = ({title})=>{

    return(
        <header className='header'>
            <h2>{title}</h2>
            
        </header>
        
    )

}
Header.defaultProps = {
    title: 'Event Tracker',
}

export default Header