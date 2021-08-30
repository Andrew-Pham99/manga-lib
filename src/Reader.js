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
        setChapterList([])
        console.log("xd")
        api.getChapterList({manga: context.state.id})
            .then((getChapterListResponse) => {
                console.log(getChapterListResponse)
                setChapterList(chapterList => getChapterListResponse.data.results); // Need this to be synchronously set so we can grab the img urls in the next .then block
                console.log(chapterList)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const getChapterImages = (chapterNum) => {
        setChapterImgUrlList([])
        api.getBaseUrl(chapterList[chapterNum].data.id) // I think we only need to call this for one chapter and it will work for all
            .then((getBaseUrlResponse) => {
                console.log(getBaseUrlResponse)
                chapterList[0].data.attributes.data.forEach((chapterImg, index) => {
                    //console.log("url is " + getBaseUrlResponse.data.baseUrl + '/data/' + chapter.data.attributes.hash + '/' + chapterImg);
                    console.log(index)
                    setChapterImgUrlList(chapterImgUrlList => [...chapterImgUrlList, api.getChapterImgUrl(getBaseUrlResponse.data.baseUrl, 'data', chapterList[chapterNum].data.attributes.hash, chapterImg)])
                    console.log(chapterImgUrlList)
                })
                    .catch((error) => {
                        console.log(error)
                    })
            })
    }
    React.useEffect(() => getChapterList(), []); // This function can be used to make things only happen once!


    return (
        // Do we want to link to different pages on each item in the nav, or do we want to spawn the chapter here?
        <div>
            <Navbar>
                <Nav className={"flex-column"} onSelect={(selectedChapterNum) => getChapterImages(selectedChapterNum)}>
                {chapterList.map((chapter, index) => (
                    <Nav.Item className={"flex-column"} key={index} chapternum={chapter.data.attributes.chapter}>Chapter {chapter.data.attributes.chapter}</Nav.Item>
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