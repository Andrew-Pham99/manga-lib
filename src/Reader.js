import React from "react"
import api from "./api"
import {Link, useLocation, useHistory} from "react-router-dom";
import {Container, Image, Navbar, Nav, Button, Card} from "react-bootstrap";
import components from "./components/components";
import { slide as Menu } from "react-burger-menu";
import './Reader.css'


function ChapterImages() {
    const context = useLocation();
    const [history, setHistory] = React.useState(useHistory());
    const [chapterImgUrlList, setChapterImgUrlList] = React.useState([]);
    const [isScroll, setIsScroll] = React.useState(true);
    const getChapterImages = (chapterId) => {
        setChapterImgUrlList([])
        api.getBaseUrl(chapterId)
            .then((getBaseUrlResponse) => {
                console.log(getBaseUrlResponse)
                context.state.curChapter.data.attributes.data.forEach((chapterImg, index) => {
                    setChapterImgUrlList(chapterImgUrlList => [...chapterImgUrlList, {url:api.getChapterImgUrl(getBaseUrlResponse.data.baseUrl, 'data', context.state.curChapter.data.attributes.hash, chapterImg), index:index}])
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    React.useEffect(() => {getChapterImages(context.state.curChapter.data.id);}, [context])
    //React.useEffect(() => {console.log(chapterImgUrlList)}, [chapterImgUrlList])
    const toggleScroll = () => {
        setIsScroll(!isScroll);
    };
    function ChapterScroll() {
        // This function will handle the rendering of the scroll version of the chapter
        return (
            <div>
                {chapterImgUrlList.map((chapterImg, index) => (
                    <Image src={chapterImg.url} key={index} alt={"Not Found"} className={"chapter_images"}></Image>
                ))}
            </div>
        );
    };
    function ChapterClick() {
        // This function will handle the rendering of the click version of the chapter
        // TODO : Make it so that clicking on the right of the image will go to the next image, and the left goes to the previous
        const [pageImg, setPageImg] = React.useState(chapterImgUrlList[0]);
        const nextImage = () => {
            if(pageImg.index < chapterImgUrlList.length - 1){
                console.log("Going to page: " + (pageImg.index + 1));
                setPageImg(chapterImgUrlList[pageImg.index + 1]);
            }
        };
        const prevImage = () => {
            if(pageImg.index > 0){
                console.log("Going to page: " + (pageImg.index - 1));
                setPageImg(chapterImgUrlList[pageImg.index - 1]);
            }
        };
        const handleKeyDown = (event) => {
            console.log(event);
            // TODO : Make left and right arrow keys change the current chapter image

        };
        return (
            <div>
                <Container>
                    <Button variant={"primary"} onClick={prevImage}>Prev Page</Button>
                    <Image src={pageImg.url} alt={"Not Found"} className={"chapter_images"}></Image>
                    <Button variant={"primary"} onClick={nextImage}>Next Page</Button>
                </Container>
            </div>
        );
    };

    return (
        <div>
            <Container>
                <Button variant={"primary"} onClick={() => toggleScroll()}>{isScroll ? "Switch to Page" : "Switch to Scroll"}</Button>
                {isScroll ?
                    <ChapterScroll/>
                    :
                    <ChapterClick/>
                }
            </Container>
        </div>
    );
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
    };

    function FindPrevChapter(){
        if(context.state.curChapter.listId - 1 < 0){
            return context.state.curChapter;
        }
        for(let idx = context.state.curChapter.listId - 1; idx < context.state.chapterList.length; --idx){
            if(context.state.chapterList[idx].data.attributes.chapter < context.state.curChapter.data.attributes.chapter){
                return context.state.chapterList[idx];
            }
        }
    };

    const HandleChapterChange = (newChapter) => {
        history.push({pathname:`/Reader/manga=${context.state.manga.id}/chapter=${newChapter.data.attributes.chapter}`, state:{manga:context.state.manga, curChapter:newChapter, chapterList:context.state.chapterList}});
    };
    console.log(context);
    // TODO : Style this element and figure out where to put it on the reader that makes sense
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

function ChapterListHamburgerMenu() {
    const context = useLocation();
    const [history, setHistory] = React.useState(useHistory());

    const HandleChapterChange = newChapter => {
        history.push({pathname:`/Reader/manga=${context.state.manga.id}/chapter=${newChapter.data.attributes.chapter}`, state:{manga:context.state.manga, curChapter:newChapter, chapterList:context.state.chapterList}});
    }
    // Finish the styling for this element
    return (
        <div>
            <Menu right  pageWrapId={"page-wrap"} outerContainerId={"App"}>
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
            </Menu>
        </div>
    )
}

function Reader() {
    const context = useLocation();
    React.useEffect(()=> console.log(context),[context])
    return (
        // TODO : Style this whole page
        <div className={"Reader"} id="App">
            <ChapterListHamburgerMenu/>
            <div id="page-wrap">
                <components.TopNavBar/>
                <Container>
                    <h1>You are reading {context.state.manga.name} Chapter {context.state.curChapter.data.attributes.chapter}</h1>
                    <NextChapterButtons/>
                    <ChapterImages/>
                </Container>
            </div>
        </div>
    );
}

export default Reader;