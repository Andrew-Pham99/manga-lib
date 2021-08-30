import React, {useEffect} from 'react'
import api from './api'
import components from './components/components'
import {useLocation} from 'react-router-dom'
import './MangaInfo.css'
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
                setChapterList(chapterList => getChapterListResponse.data.results);
            })
            .catch((error) => {
                console.log(error)
            })
        console.log(chapterList)
    }
    const getChapterImages = (chapterNum) => {
        setChapterImgUrlList([])
        api.getBaseUrl(chapterList[chapterNum].data.id)
            .then((getBaseUrlResponse) => {
                console.log(getBaseUrlResponse)
                chapterList[chapterNum].data.attributes.data.forEach((chapterImg, index) => {
                    setChapterImgUrlList(chapterImgUrlList => [...chapterImgUrlList, api.getChapterImgUrl(getBaseUrlResponse.data.baseUrl, 'data', chapterList[chapterNum].data.attributes.hash, chapterImg)])
                })
            })
            .catch((error) => {
                console.log(error)
            })
        console.log(chapterImgUrlList)
    }
    React.useEffect(() => getChapterList(), []);


    return (
        <div className="ChapterList">
            <Navbar>
                <Nav className={"flex-column"}>
                {chapterList.map((chapter, index) => (
                    <Nav.Item key={index} onClick={() => getChapterImages(index)}>
                        <Nav.Link>
                            {chapter.data.attributes.title !== "" ? `Chapter ${chapter.data.attributes.chapter} - ${chapter.data.attributes.title}` :
                            `Chapter ${chapter.data.attributes.chapter}`}
                        </Nav.Link>
                    </Nav.Item>
                    
                ))}
                </Nav>
            </Navbar>
        </div>
    );
}

function MangaInfo() {
    const [context, setContext] = React.useState(useLocation());
    return (
        <div className="MangaInfo">
            <Container>
                <h1>{context.state.name}</h1>
                <img src={context.state.img} width={250} alt={"Not Found"} />
                <ChapterListNav/>
            </Container>
        </div>
    );
};

export default MangaInfo;