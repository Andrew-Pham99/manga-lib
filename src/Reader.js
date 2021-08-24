import React from 'react'
import api from './api'
import components from './components/components'
import {useLocation} from 'react-router-dom'

function Reader() {
    console.log("We are in the reader")

    // This has all the state information we need to render the image viewer, check it out in the console
    console.log(useLocation())
    const context = useLocation();
    return (
        <h1>Welcome to {context.state.name}</h1>
    );
};

export default Reader;