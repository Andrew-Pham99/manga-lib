import React from 'react'
import api from './api'
import components from './components/components'
import {useLocation} from 'react-router-dom'
import './Reader.css'


function Reader() {
    console.log("We are in the reader")

    // This has all the state information we need to render the image viewer, check it out in the console
    console.log(useLocation())
    const context = useLocation();


    const getChapterList = () => {
        console.log("xd")
        api.getChapterList({manga:context.state.id})
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    getChapterList();

    return (
        <div className="Reader">
            <h1>{context.state.name}</h1>
            <img src={context.state.img} width={250} />
        </div>
    );
};

export default Reader;