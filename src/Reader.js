import React from "react";
import api from "./api";
import {useLocation, useHistory, Link} from "react-router-dom";
import {Container, Image, Navbar, Nav, Button, Spinner, Form, Row, Col, OverlayTrigger, Tooltip} from "react-bootstrap";
import components from "./components/components";
import { slide as Menu } from "react-burger-menu";
import './css/Reader.css';
import "./css/standard_styles.css"

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
function goToMangaInfo(context, history){
    history.push({pathname:`/Info/manga=${context.state.manga.id}`, state:context.state.manga});
}
function goToMangaInfoNewTab (event, context){
    if(event.button == 1){
        localStorage.setItem("MANGAINFO_STATE", JSON.stringify(context.state.manga));
        window.open(`/Info/manga=${context.state.manga.id}`);
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
    const defaultZoom = 1.0;
    const [scrollZoom, setScrollZoom] = React.useState(defaultZoom);
    const [pageZoom, setPageZoom] = React.useState(defaultZoom);
    const [showZoom, setShowZoom] = React.useState(false);
    const vw = Math.min(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.min(document.documentElement.clientWidth || 0, window.innerHeight || 0);
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
    // React.useLayoutEffect(() => {
    //     console.log("PRELOAD")
    //     chapterImgUrlList.forEach((chapterImg) => {
    //         const img = new Image().src = chapterImg;
    //     })
    // },[])

    const toggleScroll = () => {
        setIsScroll(!isScroll);
    };
    function ZoomBar(){
        // TODO : Add tooltip to display value of zoom
        // TODO : Add fade in/out animations and delays to the mouse over effects
        //        Probably want to do that with some CSS fuckery
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
        };
        const toggleZoom = () => {
            setShowZoom(!showZoom);
        };

        return (
            <div className={"position-relative bottom-0"} /*onMouseEnter={toggleZoomOn} onMouseLeave={toggleZoomOff}*/ style={{marginTop:30}}>
                <Button className={"fixed-bottom button-themed"} style={{marginBottom:35, marginLeft:10}} onClick={() => toggleZoom()}>{showZoom ? "Hide Zoom" : "Show Zoom"}</Button>
                <Container className={"fixed-bottom"} style={{marginBottom:35}}>
                    <Navbar className={"flex-fill rounded-3 zoom-bar"} style={{visibility: showZoom ? "visible" : "hidden"}}>
                        <Form className={"flex-fill"} style={{marginLeft:10, marginRight:10}}>
                            <Form.Label>Zoom</Form.Label>
                            <Form.Range min={"0.1"} max={"1.9"} defaultValue={isScroll ? scrollZoomVal : pageZoomVal} step={"0.05"} onChange={handleChange} id={"zoom"} name={"zoom"} tooltip={"auto"}/>
                            <Button className={"button-themed"} onClick={resetZoom}>Reset</Button>
                        </Form>
                    </Navbar>
                </Container>
            </div>
        );
    }
    function ChapterScroll() {
        // This function will handle the rendering of the scroll version of the chapter
        // React.useEffect(() => {document.getElementById("reader-window-scroll").scrollIntoView();}, []);

        return (
            <div id={"reader-window-scroll"}>
                {chapterImgUrlList.length != 0 ?
                    <Row xs={1} md={1} lg={1}>
                        {chapterImgUrlList.map((chapterImg, index) => (
                            <Col key={index}>
                                <Image src={chapterImg.url} key={index} alt={"Not Found"} id={`panelImage_${index}`}
                                       style={{height: `${(vh * scrollZoom)}px`, width: "auto"}}
                                       className={"border-start border-end border-dark"}/>
                            </Col>
                        ))}
                    </Row>
                    :
                    <components.LoadingSpinner/>
                }
            </div>
        );
    }
    function ChapterProgress(){
        // TODO : Add fade in/out animations and delays to the mouse over effects
        //        Probably want to do that with some CSS fuckery
        const [showProgress, setShowProgress] = React.useState(false);
        const toggleProgressOn = () => {
            setShowProgress(true);
        };
        const toggleProgressOff = () => {
            setShowProgress(false);
        };
        return (
            <div className={"position-relative"} onMouseEnter={() => {toggleProgressOn()}} onMouseLeave={() => {toggleProgressOff()}}>
                <Container fluid className={"reader-progress-bar fixed-bottom"}>
                    <Navbar expand={"lg"} style={{visibility: showProgress ? "visible" : "hidden"}}>
                        {chapterImgUrlList.map((chapter, index) => {
                            return (
                                <Nav key={index} className={"flex-fill"}>
                                    <Button onClick={() => setCurPage(index)} className={`align-self-center w-100 ${index <= curPage ? "button-themed" : "button-themed-outline"}`}>
                                        <span className={"visually-hidden"}>Page {index}</span>
                                    </Button>
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
        React.useEffect(() => {document.getElementById("reader-window").scrollIntoView();}, []);


        // BIG
        // Render every image then just swap visibilty with hook to prevent the loading pop in
        // Big
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

        const handleClick = (event) => {
            const clickableWidth = document.getElementById("reader-clickable").clientWidth;
            const threshold = clickableWidth / 2;
            if(event.clientX < threshold){
                prevImage();
            }
            else if(event.clientX > threshold) {
                nextImage();
            }
        };
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

        // <div id={"reader-window"} className={"min-vh-100 vh-100"} onClick={(event) => {handleClick(event);}}>
        //     <Container id={"reader-clickable"} className={"position-relative reader-window"} fluid >
        //         {chapterImgUrlList[curPage] != undefined ?
        //             <div>
        //                 <Image src={chapterImgUrlList[curPage].url} alt={"Not Found"} id={`panelImage_${curPage}`}
        //                        style={{height: `${(vh * pageZoom)}px`, width: "auto"}}
        //                        className={"border border-dark mw-100 mh-100"}/>
        //             </div>
        //             :
        //             <components.LoadingSpinner/>
        //         }
        //     </Container>
        // </div>

        return (
            <div id={"reader-window"} className={"min-vh-100 vh-100"} onClick={(event) => {handleClick(event);}}>
                <Container id={"reader-clickable"} className={"position-relative reader-window"} fluid>
                    {chapterImgUrlList.length != 0 ?
                        <div>
                            {chapterImgUrlList.map((chapterImg, index) => (
                                <Image src={chapterImg.url} key={index} alt={"Not Found"} id={`panelImage_${index}`}
                                       style={{height: `${(vh * pageZoom)}px`}}
                                       className={`border border-dark image-click ${index == curPage ? "visible" : "invisible"}`}/>
                            ))}
                        </div>
                        :
                        <components.LoadingSpinner/>
                    }
                </Container>
            </div>
        );
    }

    return (
        <div style={{marginTop:10}}>
            <Container className={"position-relative"} style={{marginBottom:10}}>
                <Button onClick={() => goToMangaInfo(context, history)} onMouseDown={(event) => goToMangaInfoNewTab(event, context)} className={"position-absolute start-0 button-themed"}>Back to MangaInfo</Button>
                <Button className={"position-absolute end-0 button-themed"} style={{right:"10px", visibility: isScroll ? "hidden" : "visible"}} onClick={() => {navigator.clipboard.writeText(chapterImgUrlList[curPage].url)}}> Copy Panel </Button>
                <Button className={isScroll ? "btn-secondary" : "button-themed"} style={{textAlign:"center"}} onClick={() => toggleScroll()}>{isScroll ? "Switch to Page" : "Switch to Scroll"}</Button>
            </Container>
            {isScroll ?
                <div id={"reader_scroll"}>
                    <ChapterScroll/>
                    <div style={{margin:10}}/>
                    <NextChapterButtons/>
                </div>
                :
                <div id={"reader_click"}>
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
    return (
        <div className={"button-chapter-nav"}>
            <Button style={{marginRight: 10}} onClick={() => HandleChapterChange(FindPrevChapter(context), context, history)} onMouseDown={(event) => HandleChapterChangeNewTab(event, FindPrevChapter(context), context)} className={"button-themed prev"}>
                Prev Chapter
            </Button>
            <Button onClick={() => HandleChapterChange(FindNextChapter(context), context, history)} onMouseDown={(event) => HandleChapterChangeNewTab(event, FindNextChapter(context), context)} className={"button-themed next"}>
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
                    <Nav className={"flex-column"} activeKey={context.state.curChapter.data.listId}>
                        <Nav.Item as={"h5"} className={"text-color clickable"} onClick={() => {goToMangaInfo(context, history);}}>{context.state.manga.title}</Nav.Item>
                        <div style={{margin:10}}/>
                        {context.state.chapterList.map((chapter, index) => (
                            <Nav.Item key={index} onClick={() => HandleChapterChange(chapter, context, history)}>
                                <Nav.Link eventKey={index} className={"chapter"}>
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
    const [history, setHistory] = React.useState(useHistory());
    if(context.state == undefined){
        context.state = JSON.parse(localStorage.getItem("READER_STATE"));
        localStorage.removeItem("READER_STATE");
    }
    React.useEffect(()=> console.log(context),[context]);
    return (
        <div className={"reader"} id="App">
            <ChapterListHamburgerMenu/>
            <div id="page-wrap">
                <components.TopNavBar/>
                <Container fluid>
                    <h1 className={"text-themed"}>
                        {context.state.manga.title}
                        : Chapter
                        {` ` + context.state.curChapter.data.attributes.chapter}

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
            <components.AboutUs/>
        </div>
    );
}

export default Reader;