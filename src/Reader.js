import React from "react";
import api from "./api";
import {useLocation, useHistory} from "react-router-dom";
import {Container, Image, Navbar, Nav, Button, Spinner, Form, Row, Col} from "react-bootstrap";
import components from "./components/components";
import { slide as Menu } from "react-burger-menu";
import './Reader.css';
// TODO : Add a button to return to the manga info page
//        Left and Right arrows to change page
//        CRTL + Left and Right arrows to chapter

function FindNextChapter(context){
    // context is the object returned by a call to useLocation()
    if(context.state.curChapter.listId + 1 >= context.state.chapterList.length){
        // If at the end of the current list, return current chapter
        return context.state.curChapter;
    }
    for(let idx = context.state.curChapter.listId + 1; idx < context.state.chapterList.length; idx++){
        // Finds next chapter where chapter number > current chapter number
        if(parseFloat(context.state.chapterList[idx].data.attributes.chapter) > parseFloat(context.state.curChapter.data.attributes.chapter)){
            return context.state.chapterList[idx];
        }
    }
}
function FindPrevChapter(context){
    // context is the object returned by a call to useLocation()
    if(context.state.curChapter.listId - 1 < 0){
        // If at the beginning of the current list, return current chapter
        return context.state.curChapter;
    }
    for(let idx = context.state.curChapter.listId - 1; idx >= 0; --idx){
        // Finds next chapter where chapter number < current chapter number
        if(parseFloat(context.state.chapterList[idx].data.attributes.chapter) < parseFloat(context.state.curChapter.data.attributes.chapter)){
            return context.state.chapterList[idx];
        }
    }
}
function HandleChapterChange(newChapter, context, history){
    // newChapter is the chapter object which you want to transition to
    // context is the context object which should have the form {manga:{}, curChapter:{}, chapterList:{}}
    // history is the object returned by a call to useHistory()
    history.push({pathname:`/Reader/manga=${context.state.manga.id}/chapter=${newChapter.data.attributes.chapter}`, state:{manga:context.state.manga, curChapter:newChapter, chapterList:context.state.chapterList}});
}

function ChapterImages() {
    const context = useLocation();
    const [history, setHistory] = React.useState(useHistory());
    const [chapterImgUrlList, setChapterImgUrlList] = React.useState([]);
    const [isScroll, setIsScroll] = React.useState(localStorage.getItem("IS_SCROLL") == "true" ? true : false);
    React.useEffect(() => {localStorage.setItem("IS_SCROLL", isScroll ? "true" : "false");}, [isScroll]);
    const [curPage, setCurPage] = React.useState(0);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const defaultZoom = 10.0;
    const [scrollZoom, setScrollZoom] = React.useState(defaultZoom);
    const [pageZoom, setPageZoom] = React.useState(defaultZoom);
    let pageZoomVal = pageZoom, scrollZoomVal = scrollZoom;

    const getChapterImages = (chapterId) => {
        setChapterImgUrlList([]);
        setCurPage(0);
        setIsLoaded(false);
        api.getBaseUrl(chapterId)
            .then((getBaseUrlResponse) => {
                console.log(getBaseUrlResponse)
                context.state.curChapter.data.attributes.data.forEach((chapterImg, index) => {
                    setChapterImgUrlList(chapterImgUrlList => [...chapterImgUrlList, {url:api.getChapterImgUrl(getBaseUrlResponse.data.baseUrl, 'data', context.state.curChapter.data.attributes.hash, chapterImg), index:index}]);
                })
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoaded(true);
    }
    React.useLayoutEffect(() => {getChapterImages(context.state.curChapter.data.id);}, [context]);
    const toggleScroll = () => {
        setIsScroll(!isScroll);
    };
    const goToMangaInfo = () => {
        history.push({pathname:`/Info/manga=${context.state.manga.id}`, state:context.state.manga});
    };
    function ZoomBar(){
        // TODO : Add tooltip to display value of zoom
        // TODO : Make the zoom bar toggle-able so that it may be hidden
        const handleChange = (event) => {
            console.log(event.target.value);
            if(isScroll){
                setScrollZoom(parseFloat(event.target.value));
                scrollZoomVal = parseFloat(event.target.value);
            }
            else{
                setPageZoom(parseFloat(event.target.value));
                pageZoomVal = parseFloat(event.target.value);
            }
        };
        const resetZoom = () => {
            isScroll ? setScrollZoom(defaultZoom) : setPageZoom(defaultZoom);
        };
        return (
            <div className={"position-relative bottom-0"}>
                <Navbar fixed={"bottom"}>
                    <Container>
                        <Navbar bg={"light"} className={"flex-fill"}>
                            <Form className={"flex-fill"} style={{marginLeft:10, marginRight:10}}>
                                <Form.Label>Zoom</Form.Label>
                                <Form.Range min={"1"} max={"19"} defaultValue={isScroll ? scrollZoomVal : pageZoomVal} step={".5"} onChange={handleChange} id={"zoom"} name={"zoom"}/>
                                <Button variant={"primary"} onClick={resetZoom}>Reset</Button>
                            </Form>
                        </Navbar>
                    </Container>
                </Navbar>
            </div>
        );
    }
    function ChapterScroll() {
        // This function will handle the rendering of the scroll version of the chapter
        return (
            <div>
                <Row xs={1} md={1} lg={1}>
                    {chapterImgUrlList.map((chapterImg, index) => (
                        <Col key={index}>
                            <Image src={chapterImg.url} key={index} alt={"Not Found"} style={{width:`${(scrollZoom / 10) * 50}%`}} className={"border border-dark"}/>
                        </Col>
                    ))}
                </Row>
            </div>
        );
    }
    function ChapterClick() {
        // This function will handle the rendering of the click version of the chapter
        // TODO : Make it so that clicking on the right of the image will go to the next image, and the left goes to the previous

        const nextImage = () => {
            if(chapterImgUrlList[curPage].index < chapterImgUrlList.length - 1){
                console.log("Going to page: " + (chapterImgUrlList[curPage].index + 1));
                setCurPage(curPage + 1);
            }
            else {
                // Go to next chapter because we are at the end of the current
                HandleChapterChange(FindNextChapter(context),context, history);
            }
        };
        const prevImage = () => {
            if(chapterImgUrlList[curPage].index > 0){
                console.log("Going to page: " + (chapterImgUrlList[curPage].index - 1));
                setCurPage(curPage - 1);
            }
            else {
                // Go to previous chapter since we are at the beginning of the current
                HandleChapterChange(FindPrevChapter(context),context, history);
            }
        };
        const handleKeyDown = (event) => {
            console.log(event);
            // TODO : Make left and right arrow keys change the current chapter image
            //          Need to handle key presses on the document so that the the onClick event can be triggered

        };
        return (
            <div style={{marginBottom:100}} id={"readerWindow"}>
                <Container className={"border border-dark position-relative"}>
                    {chapterImgUrlList[curPage] != undefined ?
                        <div>
                            <Button variant={"outline-primary"} className={"position-absolute top-0 start-0 flex-shrink-1 h-100"} onClick={prevImage}>{chapterImgUrlList[curPage].index == 0 ? "Prev Chapter" : "Prev Page"}</Button>
                            <Image src={chapterImgUrlList[curPage].url} alt={"Not Found"} style={{width: `${(pageZoom / 10) * 50}%`}} className={"border border-dark mw-100"}/>
                            <Button variant={"outline-primary"} className={"position-absolute top-0 end-0 flex-shrink-1 h-100"} onClick={nextImage}>{chapterImgUrlList[curPage].index == chapterImgUrlList.length - 1 ? "Next Chapter" : "Next Page"}</Button>
                        </div>
                        :
                        <Container style={{align:'center'}}>
                            <Spinner animation={"border"} role={"status"} variant={"primary"}>
                                <span className={"visually-hidden"}>Loading...</span>
                            </Spinner>
                        </Container>
                    }
                </Container>
            </div>
        );
    }

    return (
        <div>
            <Container className={"border border-dark position-relative"}>
                <Button variant={"primary"} onClick={() => goToMangaInfo()} className={"position-absolute start-0"}>Back to MangaInfo</Button>
                <Button variant={isScroll ? "primary" : "success"} onClick={() => toggleScroll()}>{isScroll ? "Switch to Page" : "Switch to Scroll"}</Button>
            </Container>
            {isScroll ?
                <div>
                    <ChapterScroll/>
                </div>
                :
                <div>
                    <ChapterClick/>
                </div>
            }
            <ZoomBar/>
        </div>
    );
}

function NextChapterButtons() {
    const context = useLocation();
    const [history, setHistory] = React.useState(useHistory());

    // TODO : Style this element and figure out where to put it on the reader that makes sense
    return (
        <div>
            <Button onClick={() => HandleChapterChange(FindPrevChapter(context), context, history)}>
                Prev Chapter
            </Button>
            <Button onClick={() => HandleChapterChange(FindNextChapter(context), context, history)}>
                Next Chapter
            </Button>
        </div>
    )
}

function ChapterListHamburgerMenu() {
    const context = useLocation();
    const [history, setHistory] = React.useState(useHistory());

    return (
        <div>
            <Menu right  pageWrapId={"page-wrap"} outerContainerId={"App"}>
                <Navbar  className="ChapterList">
                    <Nav className={"flex-column"}>
                        {context.state.chapterList.map((chapter, index) => (
                            <Nav.Item key={index} onClick={() => HandleChapterChange(chapter, context, history)}>
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
    React.useEffect(()=> console.log(context),[context]);
    return (
        // TODO : Style this whole page
        <div className={"Reader"} id="App">
            <ChapterListHamburgerMenu/>
            <div id="page-wrap">
                <components.TopNavBar/>
                <Container fluid>
                    <h1>You are reading {context.state.manga.name}: Chapter
                        {` ` + context.state.curChapter.data.attributes.chapter} -
                        {context.state.curChapter.data.attributes.title !== "" ?
                            ` ${context.state.curChapter.data.attributes.title}`
                            :
                            ``
                        }
                    </h1>
                    <NextChapterButtons/>
                    <ChapterImages/>
                </Container>
            </div>
        </div>
    );
}

export default Reader;