import React from "react";
import api from "./api";
import {useLocation, useHistory} from "react-router-dom";
import {Container, Image, Navbar, Nav, Button, Spinner, Form, Row, Col} from "react-bootstrap";
import components from "./components/components";
import { slide as Menu } from "react-burger-menu";
import './Reader.css';

// TODO : Fetch the next part of the chapter list when at the end of the current part
function ChapterImages() {
    const context = useLocation();
    const [history, setHistory] = React.useState(useHistory());
    const [chapterImgUrlList, setChapterImgUrlList] = React.useState([]);
    const [isScroll, setIsScroll] = React.useState(localStorage.getItem("IS_SCROLL") == "true" ? true : false);
    React.useEffect(() => {localStorage.setItem("IS_SCROLL", isScroll ? "true" : "false");}, [isScroll]);
    const [curPage, setCurPage] = React.useState(0);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [scrollZoom, setScrollZoom] = React.useState(10.0);
    const [pageZoom, setPageZoom] = React.useState(10.0);
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
    function ZoomBar(){
        // TODO : Add tooltip to display value of zoom
        const handleChange = (event) => {
            if(isScroll){
                setScrollZoom(parseInt(event.target.value));
                scrollZoomVal = parseInt(event.target.value);
            }
            else{
                setPageZoom(parseInt(event.target.value));
                pageZoomVal = parseInt(event.target.value);
            }
        };
        return (
            // This navbar should appear in the middle of the screen
            <div className={"position-relative bottom-0"}>
                <Navbar fixed={"bottom"}>
                    <Container>
                        <Navbar bg={"light"} className={"flex-fill"}>
                            <Form className={"flex-fill"} style={{marginLeft:10, marginRight:10}}>
                                <Form.Label>Zoom</Form.Label>
                                <Form.Range min={"1"} max={"21"} defaultValue={isScroll ? scrollZoomVal : pageZoomVal} step={"1"} onChange={handleChange} id={"zoom"} name={"zoom"}/>
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
                            <Image src={chapterImg.url} key={index} alt={"Not Found"} style={{width:`${(scrollZoom / 10) * 51}%`}}/>
                        </Col>
                    ))}
                </Row>
            </div>
        );
    }
    function ChapterClick() {
        // This function will handle the rendering of the click version of the chapter
        // TODO : Make it so that clicking on the right of the image will go to the next image, and the left goes to the previous
        function FindNextChapter(){
            if(context.state.curChapter.listId + 1 >= context.state.chapterList.length){
                return context.state.curChapter;
            }
            for(let idx = context.state.curChapter.listId + 1; idx < context.state.chapterList.length; idx++){
                if(parseInt(context.state.chapterList[idx].data.attributes.chapter, 10) > parseInt(context.state.curChapter.data.attributes.chapter, 10)){
                    return context.state.chapterList[idx];
                }
            }
        }
        function FindPrevChapter(){
            if(context.state.curChapter.listId - 1 < 0){
                return context.state.curChapter;
            }
            for(let idx = context.state.curChapter.listId - 1; idx >= 0; --idx){
                if(parseInt(context.state.chapterList[idx].data.attributes.chapter, 10) < parseInt(context.state.curChapter.data.attributes.chapter, 10)){
                    return context.state.chapterList[idx];
                }
            }
        }
        const HandleChapterChange = (newChapter) => {
            history.push({pathname:`/Reader/manga=${context.state.manga.id}/chapter=${newChapter.data.attributes.chapter}`, state:{manga:context.state.manga, curChapter:newChapter, chapterList:context.state.chapterList}});
        };

        const nextImage = () => {
            if(chapterImgUrlList[curPage].index < chapterImgUrlList.length - 1){
                console.log("Going to page: " + (chapterImgUrlList[curPage].index + 1));
                setCurPage(curPage + 1);
            }
            else {
                HandleChapterChange(FindNextChapter());
            }
        };
        const prevImage = () => {
            if(chapterImgUrlList[curPage].index > 0){
                console.log("Going to page: " + (chapterImgUrlList[curPage].index - 1));
                setCurPage(curPage - 1);
            }
            else {
                // Go to previous chapter since we are at the beginning of the current
                HandleChapterChange(FindPrevChapter());
            }
        };
        const handleKeyDown = (event) => {
            console.log(event);
            // TODO : Make left and right arrow keys change the current chapter image

        };
        return (
            <div style={{marginBottom:100}}>
                <Container className={"border border-dark position-relative "}>
                    {chapterImgUrlList[curPage] != undefined ?
                        <div className={"align-items-stretch"}>
                            <Button variant={"outline-primary"} className={"position-absolute top-0 start-0 flex-shrink-1 h-100"} onClick={prevImage}>{chapterImgUrlList[curPage].index == 0 ? "Prev Chapter" : "Prev Page"}</Button>
                            <Image src={chapterImgUrlList[curPage].url} alt={"Not Found"} style={{width: `${(pageZoom / 10) * 51}%`}} className={"border border-dark flex-grow-1 mw-100"}/>
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
            <Button variant={"primary"} onClick={() => toggleScroll()}>{isScroll ? "Switch to Page" : "Switch to Scroll"}</Button>
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
    // Can we export these to be used in ChapterClick() without having to duplicate the code
    // Probably need some kind of export
    function FindNextChapter(){
        if(context.state.curChapter.listId + 1 >= context.state.chapterList.length){
            return context.state.curChapter;
        }
        for(let idx = context.state.curChapter.listId + 1; idx < context.state.chapterList.length; idx++){
            if(parseInt(context.state.chapterList[idx].data.attributes.chapter, 10) > parseInt(context.state.curChapter.data.attributes.chapter, 10)){
                return context.state.chapterList[idx];
            }
        }
    }

    function FindPrevChapter(){
        if(context.state.curChapter.listId - 1 < 0){
            return context.state.curChapter;
        }
        for(let idx = context.state.curChapter.listId - 1; idx >= 0; --idx){
            if(parseInt(context.state.chapterList[idx].data.attributes.chapter, 10) < parseInt(context.state.curChapter.data.attributes.chapter, 10)){
                return context.state.chapterList[idx];
            }
        }
    }

    const HandleChapterChange = (newChapter) => {
        history.push({pathname:`/Reader/manga=${context.state.manga.id}/chapter=${newChapter.data.attributes.chapter}`, state:{manga:context.state.manga, curChapter:newChapter, chapterList:context.state.chapterList}});
    };

    // TODO : Style this element and figure out where to put it on the reader that makes sense
    return (
        <div>
            <Button onClick={() => HandleChapterChange(FindPrevChapter())}>
                Prev Chapter
            </Button>
            <Button onClick={() => HandleChapterChange(FindNextChapter())}>
                Next Chapter
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
    React.useEffect(()=> console.log(context),[context]);
    return (
        // TODO : Style this whole page
        <div className={"Reader"} id="App">
            <ChapterListHamburgerMenu/>
            <div id="page-wrap">
                <components.TopNavBar/>
                <Container fluid>
                    <h1>You are reading {context.state.manga.name} Chapter {context.state.curChapter.data.attributes.chapter}</h1>
                    <NextChapterButtons/>
                    <ChapterImages/>
                </Container>
            </div>
        </div>
    );
}

export default Reader;