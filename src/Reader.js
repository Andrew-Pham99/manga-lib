import React, {useEffect} from 'react'
import api from './api'
import components from './components/components'
import {useLocation} from 'react-router-dom'
import './Reader.css'
import {Navbar, Nav} from "react-bootstrap";

function ChapterListNav() {
    const [context, setContext] = React.useState(useLocation());
    const [chapterList, setChapterList] = React.useState();
    const getChapterList = () => {
        console.log("xd")
        api.getChapterList({manga:context.state.id})
            .then((response) => {
                setChapterList(response.data.results)
                console.log(chapterList)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    React.useEffect(() => getChapterList(), []); // This function can be used to make things only happen once!

    return (
        // Do we want to link to different pages on each item in the nav, or do we want to spawn the chapter here?
        <div>
            <Navbar>
                <Nav className={"flex-column"}>
                {chapterList.map((chapter) => (
                    <Nav className={"flex-column"}>Chapter {chapter.data.attributes.chapter}</Nav>
                ))}
                </Nav>
            </Navbar>
        </div>
    );
}

function Reader(props) {
    console.log("We are in the reader")
    const [context, setContext] = React.useState(useLocation());

    return (
        <div className="Reader">
            <h1>{context.state.name}</h1>
            <img src={context.state.img} width={250} />
            <ChapterListNav/>
        </div>
    );
};

export default Reader;