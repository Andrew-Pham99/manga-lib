import React, {useEffect} from 'react'
import api from './api'
import components from './components/components'
import {useLocation} from 'react-router-dom'
import './Reader.css'
import {Navbar, Nav, Container} from "react-bootstrap";

function ChapterListNav() {
    const [context, setContext] = React.useState(useLocation());
    const [chapterList, setChapterList] = React.useState([]);
    const [chapterImgUrlList, setChapterImgUrlList] = React.useState([]);
    const getChapterList = () => {
        console.log("xd")
        api.getChapterList({manga:context.state.id})
            .then((response) => {
                console.log(response)
                setChapterList(chapterList => response.data.results); // Need this to be synchronously set so we can grab the img urls in the next .then block
                console.log(chapterList)
                return api.getBaseUrl(response.data.results[0].data.id) // I think we only need to call this for one chapter and it will work for all
            })
            .then((response) => {
                chapterList[0].data.attributes.data.forEach(chapterImg => {
                    //console.log("url is " + response.data.baseUrl + '/data/' + chapter.data.attributes.hash + '/' + chapterImg);
                    setChapterImgUrlList(chapterImgUrlList => [...chapterImgUrlList, api.getChapterImgUrl(response.data.baseUrl, 'data', chapterList[0].data.attributes.hash, chapterImg)])
                    console.log(chapterImgUrlList)
                })
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
                {chapterList.map((chapter, index) => (
                    <Nav className={"flex-column"} key={index}>Chapter {chapter.data.attributes.chapter}</Nav>
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
            <Container>
                <h1>{context.state.name}</h1>
                <img src={context.state.img} width={250} alt={"Not Found"} />
                <ChapterListNav/>
            </Container>
        </div>
    );
};

export default Reader;