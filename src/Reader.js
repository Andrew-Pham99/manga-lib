import React from "react"
import api from "./api"
import {Link, useLocation} from "react-router-dom";
import {Container, Image, Navbar, Nav} from "react-bootstrap";
import components from "./components/components";

function ChapterImages() {
    const [context, setContext] = React.useState(useLocation());
    const [chapterImgUrlList, setChapterImgUrlList] = React.useState([]);
    const getChapterImages = (chapterId) => {
        setChapterImgUrlList([])
        api.getBaseUrl(chapterId)
            .then((getBaseUrlResponse) => {
                console.log(getBaseUrlResponse)
                context.state.curChapter.data.attributes.data.forEach((chapterImg, index) => {
                    setChapterImgUrlList(chapterImgUrlList => [...chapterImgUrlList, api.getChapterImgUrl(getBaseUrlResponse.data.baseUrl, 'data', context.state.curChapter.data.attributes.hash, chapterImg)])
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    React.useEffect(() => {getChapterImages(context.state.curChapter.data.id);}, [])
    //React.useEffect(() => console.log(chapterImgUrlList), [chapterImgUrlList]) // Logs every time the url list updates, remove if annoying

    return (
        <div>
            <Container>
                {chapterImgUrlList.map((chapterImg, index) => (
                    <Image src={chapterImg} key={index} alt={"Not Found"}></Image>
                ))}
            </Container>
        </div>
    )
}

function ChapterListHamburgerMenu() { // Make the chapter list hamburger menu in here
    return (
        <div>
        </div>
    )
}

function Reader() {
    const [context, setContext] = React.useState(useLocation());
    React.useEffect(()=> console.log(context),[context])
    return (
        <div className={"Reader"}>
            <components.TopNavBar
              placeholder={"Find a Manga!"}
            />
            <Container>
                <h1>You are reading {context.state.manga.name} Chapter {context.state.curChapter.data.attributes.chapter}</h1>
                <ChapterListHamburgerMenu/>
                <ChapterImages/>
            </Container>
        </div>
    );
}

export default Reader;