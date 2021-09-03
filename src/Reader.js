import React, {useEffect} from "react"
import api from "./api"
import {Link, useLocation, useHistory} from "react-router-dom";
import {Container, Image, Navbar, Nav} from "react-bootstrap";
import components from "./components/components";

function ChapterImages() {
    const context = useLocation();
    const [history, setHistory] = React.useState(useHistory());
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
    const HandleChapterChange = newChapter => {
        history.push({pathname:`/Reader/manga=${context.state.manga.id}/chapter=${newChapter.data.attributes.chapter}`, state:{manga:context.state.manga, curChapter:newChapter, chapterList:context.state.chapterList}});
    }
    React.useEffect(() => {getChapterImages(context.state.curChapter.data.id);}, [context])
    // React.useEffect(() => {console.log(context);}, [context])
    // React.useEffect(() => {console.log(history);}, [history])

    return (
        <div>
            <Navbar className="ChapterList">
                <Nav className={"flex-column"}>
                    {context.state.chapterList.map((chapter, index) => (
                        <Nav.Item key={index} onClick={()=>HandleChapterChange(chapter)}>
                            <Nav.Link>
                                {chapter.data.attributes.title !== "" ? `Chapter ${chapter.data.attributes.chapter} - ${chapter.data.attributes.title}` :
                                    `Chapter ${chapter.data.attributes.chapter}`}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </Navbar>
            <Container>
                {chapterImgUrlList.map((chapterImg, index) => (
                    <Image src={chapterImg} key={index} alt={"Not Found"}></Image>
                ))}
            </Container>
        </div>
    )
}

function ChapterListHamburgerMenu() { // Make the chapter list hamburger menu in here
    const [context, setContext] = React.useState(useLocation());
    return (
        <div>
            <Navbar  className="ChapterList">
                <Nav className={"flex-column"}>
                    {context.state.chapterList.map((chapter, index) => (
                        <Nav.Item key={index}>
                            <Nav.Link>
                                <Link className="chapter" to={{pathname:`/Reader/manga=${context.state.manga.id}/chapter=${chapter.data.attributes.chapter}`, state:{manga:context.state, curChapter:chapter, chapterList:context.state.chapterList}}}>
                                    {chapter.data.attributes.title !== "" ? `Chapter ${chapter.data.attributes.chapter} - ${chapter.data.attributes.title}` :
                                        `Chapter ${chapter.data.attributes.chapter}`}
                                </Link>
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </Navbar>
        </div>
    )
}

function Reader() {
    const [context, setContext] = React.useState(useLocation());
    React.useEffect(()=> console.log(context),[context])
    return (
        <div className={"Reader"}>
            <components.TopNavBar/>
            <Container>
                <h1>You are reading {context.state.manga.name} Chapter {context.state.curChapter.data.attributes.chapter}</h1>
                <ChapterImages/>
            </Container>
        </div>
    );
}

export default Reader;