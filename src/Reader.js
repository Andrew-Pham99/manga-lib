import React from "react"
import api from "./api"
import {Link, useLocation, useHistory} from "react-router-dom";
import {Container, Image, Navbar, Nav, Button} from "react-bootstrap";
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
    React.useEffect(() => {getChapterImages(context.state.curChapter.data.id);}, [context])

    return (
        <div>
            <Container>
                {chapterImgUrlList.map((chapterImg, index) => (
                    <Image src={chapterImg} key={index} alt={"Not Found"} className={"chapter_images"} class></Image>
                ))}
            </Container>
        </div>
    )
}

function NextChapterButtons() {
    const context = useLocation();
    const [history, setHistory] = React.useState(useHistory());

    const FindNextChapter = () => {
        if(context.state.curChapter.listId + 1 >= context.state.chapterList.length){
            return context.state.curChapter;
        }
        for(let idx = context.state.curChapter.listId + 1; idx < context.state.chapterList.length; idx++){
            if(context.state.chapterList[idx].data.attributes.chapter > context.state.curChapter.data.attributes.chapter){
                return context.state.chapterList[idx];
            }
        }
    }

    function FindPrevChapter(){
        if(context.state.curChapter.listId - 1 < 0){
            return context.state.curChapter;
        }
        for(let idx = context.state.curChapter.listId - 1; idx < context.state.chapterList.length; --idx){
            if(context.state.chapterList[idx].data.attributes.chapter < context.state.curChapter.data.attributes.chapter){
                return context.state.chapterList[idx];
            }
        }
    }

    const HandleChapterChange = (newChapter) => {
        history.push({pathname:`/Reader/manga=${context.state.manga.id}/chapter=${newChapter.data.attributes.chapter}`, state:{manga:context.state.manga, curChapter:newChapter, chapterList:context.state.chapterList}});
    }
    console.log(context);
    // Finish styling for this element
    return (
        <div>
            <Button onClick={() => HandleChapterChange(FindPrevChapter())}>
                Prev
            </Button>
            <Button onClick={() => HandleChapterChange(FindNextChapter())}>
                Next
            </Button>
        </div>
    )
}

function ChapterListHamburgerMenu() { // Make the chapter list hamburger menu in here
    const context = useLocation();
    const [history, setHistory] = React.useState(useHistory());

    const HandleChapterChange = newChapter => {
        history.push({pathname:`/Reader/manga=${context.state.manga.id}/chapter=${newChapter.data.attributes.chapter}`, state:{manga:context.state.manga, curChapter:newChapter, chapterList:context.state.chapterList}});
    }
    // Finish the styling for this element
    return (
        <div>
            <Navbar  className="ChapterList">
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
        </div>
    )
}

function Reader() {
    const context = useLocation();
    React.useEffect(()=> console.log(context),[context])
    return (
        <div className={"Reader"}>
            <components.TopNavBar/>
            <Container>
                <h1>You are reading {context.state.manga.name} Chapter {context.state.curChapter.data.attributes.chapter}</h1>
                <NextChapterButtons/>
                <ChapterListHamburgerMenu/>
                <ChapterImages/>
            </Container>
        </div>
    );
}

export default Reader;