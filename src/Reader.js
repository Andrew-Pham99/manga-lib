import React from "react";
import api from "./api";
import {useLocation, useHistory} from "react-router-dom";
import {Container, Image, Navbar, Nav, Button, Spinner, Form, Row, Col, OverlayTrigger, Tooltip} from "react-bootstrap";
import components from "./components/components";
import { slide as Menu } from "react-burger-menu";
import './Reader.css';

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
function HandleChapterChangeNewTab(event, newChapter, context){
    // event is passed from the DOM event handler
    // newChapter is the chapter object you wish to switch to
    // context is the object returned by a call to useLocation()
    if(event.button == 1){
        localStorage.setItem("READER_STATE", JSON.stringify({manga:context.state.manga, curChapter:newChapter, chapterList:context.state.chapterList}));
        window.open(`/Reader/manga=${context.state.manga.id}/chapter=${newChapter.data.attributes.chapter}`);
    }
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
    const [showZoom, setShowZoom] = React.useState(false);
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
    //Preload images.
    React.useEffect(() => {
        console.log("PRELOAD")
        chapterImgUrlList.forEach((chapterImg) => {
            const img = new Image().src = chapterImg
            
            
        })
        

    },[])
    const toggleScroll = () => {
        setIsScroll(!isScroll);
    };
    const goToMangaInfo = () => {
        history.push({pathname:`/Info/manga=${context.state.manga.id}`, state:context.state.manga});
    };
    const goToMangaInfoNewTab = (event) => {
        if(event.button == 1){
            localStorage.setItem("MANGAINFO_STATE", JSON.stringify(context.state.manga));
            window.open(`/Info/manga=${context.state.manga.id}`);
        }
    };
    function ZoomBar(){
        // TODO : Add tooltip to display value of zoom
        const zoomToolTip = () => {
            return (
                <Tooltip id={"zoom-bar-tooltip"}>
                    {isScroll ? scrollZoomVal : pageZoomVal}
                </Tooltip>
            );
        }
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
        const toggleZoomOn = () => {
            setShowZoom(true);
        };
        const toggleZoomOff = () => {
            setShowZoom(false);
        }

        return (
            <div className={"position-relative bottom-0"} onMouseEnter={toggleZoomOn} onMouseLeave={toggleZoomOff}>
                <Navbar fixed={"bottom"}>
                    <Container>
                        <Navbar bg={"light"} className={"flex-fill"} style={{visibility: showZoom ? "visible" : "hidden"}}>
                            <Form className={"flex-fill"} style={{marginLeft:10, marginRight:10}}>
                                <Form.Label>Zoom</Form.Label>
                                <Form.Range min={"1"} max={"19"} defaultValue={isScroll ? scrollZoomVal : pageZoomVal} step={".5"} onChange={handleChange} id={"zoom"} name={"zoom"} tooltip={"auto"}/>
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
    function ChapterProgress(){
        return (
            <div className={"position-relative"} >
                <Container fluid className={"border border-dark"}>
                    <Navbar expand={"lg"}>
                        {chapterImgUrlList.map((chapter, index) => {
                            return (
                                <Nav key={index} className={"flex-fill"}>
                                    <Button variant={index <= curPage ? "primary" : "outline-primary"} onClick={() => setCurPage(index)} className={"align-self-center w-100"}></Button>
                                </Nav>
                            )
                        })}
                    </Navbar>
                </Container>
            </div>
        );
    }
    function ChapterClick() {
        // This function will handle the rendering of the click version of the chapter
        // TODO : Make it so that clicking on the right of the image will go to the next image, and the left goes to the previous

        // TODO : Make a page indicator to display progress through the chapter

        document.onkeydown = checkKey;
        function checkKey(e) {
            //e = e || window.event;
            if (e.keyCode == '37' && !e.ctrlKey) {
               // left arrow
               prevImage()
            }
            else if (e.keyCode == '39' && !e.ctrlKey) {
               // right arrow
               nextImage()
            }
        }

        // function keyboardChapterChange(event){
        //     event.preventDefault();
        //     if (event.ctrlKey && event.key === 'ArrowLeft') {
        //         HandleChapterChange(FindPrevChapter(context),context, history);
        //     }
        //     else if (event.ctrlKey && event.key === 'ArrowRight') {
        //         HandleChapterChange(FindNextChapter(context),context, history);
        //     }
        // }
        //
        // React.useEffect(() => {
        //     document.addEventListener('keydown', (event) => keyboardChapterChange(event), {once:true});
        //     return () => document.removeEventListener('keydown', (event) => keyboardChapterChange(event));
        // }, []);
        
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



        /*
        sandwiched the img src
        <Button variant={"outline-primary"} className={"position-absolute top-0 start-0 flex-shrink-1 h-100"} onClick={prevImage}>{chapterImgUrlList[curPage].index == 0 ? "Prev Chapter" : "Prev Page"}</Button>
        <Button variant={"outline-primary"} className={"position-absolute top-0 end-0 flex-shrink-1 h-100"} onClick={nextImage}>{chapterImgUrlList[curPage].index == chapterImgUrlList.length - 1 ? "Next Chapter" : "Next Page"}</Button>
        */
        return (
            <div style={{marginBottom:100}} id={"readerWindow"}>
                <Container className={"border border-white position-relative"}>

                    {/*TODO : Make the buttons span to half of the container and make the*/}
                    {/*        container height as close to the default height of the image as possible*/}
                    {chapterImgUrlList[curPage] != undefined ?
                        <div>

                            <Image src={chapterImgUrlList[curPage].url} alt={"Not Found"} style={{width: `${(pageZoom / 10) * 50}%`, margin:"auto"}} className={"border border-dark mw-100"} />
                            
                            <Button type="submit" style={{ float: "left",    background:"transparent", border:"none", color:"transparent" 
                            ,boxShadow:"none",height: "100%", width:"50%", position:"absolute", top:0, left:0}}
                                onClick={prevImage} />

                            <Button type="submit" style={{ float: "right", background:"transparent", border:"none", color:"transparent" 
                            ,boxShadow:"none",height: "100%", width:"50%", position:"absolute", top:0, left:"50%"}}
                                onClick={nextImage}/>

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


    /* <Button variant={"primary"} className={"position-absoute start--1"} onClick={() => {navigator.clipboard.writeText(chapterImgUrlList[curPage].url)}}> Copy Panel </Button>
    */
    return (
        <div style={{marginTop:10}}>
            <Container className={"position-relative"}>
                <Button variant={"primary"} onClick={() => goToMangaInfo()} onMouseDown={(event) => goToMangaInfoNewTab(event)} className={"position-absolute start-0"}>Back to MangaInfo</Button>
                    <Button variant={"primary"} className={"position-absolute"} style={{right:"10px"}} onClick={() => {navigator.clipboard.writeText(chapterImgUrlList[curPage].url)}}> Copy Panel </Button>
                <Button variant={isScroll ? "primary" : "success"} style={{textAlign:"center"}} onClick={() => toggleScroll()}>{isScroll ? "Switch to Page" : "Switch to Scroll"}</Button>
            </Container>
            {isScroll ?
                <div>
                    <ChapterScroll/>
                </div>
                :
                <div>
                    <ChapterClick/>
                    <ChapterProgress/>
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
            <Button style={{marginRight: 10}} onClick={() => HandleChapterChange(FindPrevChapter(context), context, history)} onMouseDown={(event) => HandleChapterChangeNewTab(event, FindPrevChapter(context), context)}>
                Prev Chapter
            </Button>
            <Button onClick={() => HandleChapterChange(FindNextChapter(context), context, history)} onMouseDown={(event) => HandleChapterChangeNewTab(event, FindNextChapter(context), context)}>
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
    if(context.state == undefined){
        context.state = JSON.parse(localStorage.getItem("READER_STATE"));
        localStorage.removeItem("READER_STATE");
    }
    React.useEffect(()=> console.log(context),[context]);
    return (
        // TODO : Style this whole page
        <div className={"Reader"} id="App">
            <ChapterListHamburgerMenu/>
            <div id="page-wrap">
                <components.TopNavBar/>
                <Container fluid>
                    <h1>{context.state.manga.name}: Chapter
                        {` ` + context.state.curChapter.data.attributes.chapter} -

                        {context.state.curChapter.data.attributes.title !== "" ?
                            ` - ${context.state.curChapter.data.attributes.title}`
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