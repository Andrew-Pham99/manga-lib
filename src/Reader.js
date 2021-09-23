import React from "react"
import api from "./api"
import {Link, useLocation, useHistory} from "react-router-dom";
import {Container, Image, Navbar, Nav, Button, Spinner, Form} from "react-bootstrap";
import components from "./components/components";
import { slide as Menu } from "react-burger-menu";
import './Reader.css'

// TODO : Add a zoom slider to the bottom of the page
function ChapterImages() {
    const context = useLocation();
    const [history, setHistory] = React.useState(useHistory());
    const [chapterImgUrlList, setChapterImgUrlList] = React.useState([]);
    const persistIsScroll = localStorage.getItem("IS_SCROLL");
    const [isScroll, setIsScroll] = React.useState(persistIsScroll);
    React.useEffect(() => {localStorage.setItem("IS_SCROLL", isScroll)}, [isScroll]);
    const [curPage, setCurPage] = React.useState(0);
    const [pageImg, setPageImg] = React.useState(chapterImgUrlList[curPage]);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [scrollZoom, setScrollZoom] = React.useState(1.0);
    const [pageZoom, setPageZoom] = React.useState(1.0);

    const getChapterImages = (chapterId) => {
        setChapterImgUrlList([]);
        setIsLoaded(false);
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
        setPageImg(chapterImgUrlList[0]);
        setCurPage(0);
        setIsLoaded(true);
    }
    React.useLayoutEffect(() => {getChapterImages(context.state.curChapter.data.id);}, [context])
    //React.useEffect(() => {console.log(chapterImgUrlList)}, [chapterImgUrlList])
    const toggleScroll = () => {
        setIsScroll(!isScroll);
    };
    function ChapterScroll() {
        // This function will handle the rendering of the scroll version of the chapter
        function ScrollZoom(){
            // This is only semi functional, not sure what is wrong with it
            // The graphics dont update to what the value is set to
            // Maybe want to use a bootstrap element instead of the <input> element
            const handleChange = (event) => {
                setScrollZoom(parseInt(event.target.value));
            };
            React.useEffect(() => {console.log("Scroll Zoom factor is: " + (scrollZoom))}, [scrollZoom])
            return (
                <div>
                    <Navbar fixed={"bottom"}>
                        <input type={"range"} min={"1"} max={"5"} defaultValue={"1"} step={"0.1"} onChange={handleChange} id={"scrollZoom"} name={"scrollZoom"}></input>
                        <label for={"scrollZoom"}>Zoom</label>
                    </Navbar>
                </div>
            );
        }
        return (
            <div>
                {chapterImgUrlList.map((chapterImg, index) => (
                    <Image src={chapterImg.url} key={index} alt={"Not Found"} style={{width:`${scrollZoom * 51}%`}}></Image>
                ))}
                <ScrollZoom/>
            </div>
        );
    };
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
        };
        function FindPrevChapter(){
            if(context.state.curChapter.listId - 1 < 0){
                return context.state.curChapter;
            }
            for(let idx = context.state.curChapter.listId - 1; idx >= 0; --idx){
                if(parseInt(context.state.chapterList[idx].data.attributes.chapter, 10) < parseInt(context.state.curChapter.data.attributes.chapter, 10)){
                    return context.state.chapterList[idx];
                }
            }
        };
        const HandleChapterChange = (newChapter) => {
            history.push({pathname:`/Reader/manga=${context.state.manga.id}/chapter=${newChapter.data.attributes.chapter}`, state:{manga:context.state.manga, curChapter:newChapter, chapterList:context.state.chapterList}});
        };
        function PageZoom(){
            // This is only semi functional, not sure what is wrong with it
            // The graphics do not update with what the bar is set to
            const handleChange = (event) => {
                setPageZoom(parseInt(event.target.value));
            };
            React.useEffect(() => {console.log("Page Zoom Factor is: " + (pageZoom))}, [pageZoom])
            return (
                <div>
                    <Navbar fixed={"bottom"}>
                        <input type={"range"} min={"1"} max={"5"} defaultValue={"1"} step={"0.1"} onChange={handleChange} id={"pageZoom"} name={"pageZoom"}></input>
                        <label for={"pageZoom"}>Zoom</label>
                    </Navbar>
                </div>
            );
        }

        setPageImg(chapterImgUrlList[curPage]);

        const nextImage = () => {
            if(pageImg.index < chapterImgUrlList.length - 1){
                console.log("Going to page: " + (pageImg.index + 1));
                setPageImg(chapterImgUrlList[pageImg.index + 1]);
                setCurPage(curPage + 1);
            }
            else {
                // Go to next chapter since we are at the end of the current
                HandleChapterChange(FindNextChapter());
            };
        };
        const prevImage = () => {
            if(pageImg.index > 0){
                console.log("Going to page: " + (pageImg.index - 1));
                setPageImg(chapterImgUrlList[pageImg.index - 1]);
                setCurPage(curPage - 1);
            }
            else {
                // Go to previous chapter since we are at the beginning of the current
                HandleChapterChange(FindPrevChapter());
            };
        };
        const handleKeyDown = (event) => {
            console.log(event);
            // TODO : Make left and right arrow keys change the current chapter image

        };
        return (
            <div>
                <Container>
                    {/*Need to make this wait for pageImg to be loaded else an error is thrown because the api call hasn't been completed*/}
                    {pageImg != undefined ?
                        <div>
                            <Button variant={"primary"} onClick={prevImage}>{pageImg.index == 0 ? "Prev Chapter" : "Prev Page"}</Button>
                            <Image src={pageImg.url} alt={"Not Found"} style={{width: `${pageZoom * 51}%`}}></Image>
                            <Button variant={"primary"} onClick={nextImage}>{pageImg.index == chapterImgUrlList.length - 1 ? "Next Chapter" : "Next Page"}</Button>
                            <PageZoom/>
                        </div>
                        :
                        <Container style={{align:'center'}}>
                            <Spinner animation={"border"} role={"status"} variant={"primary"}>
                                <span className={"visually-hidden"}>Loading...</span>
                            </Spinner>
                        </Container>
                    }
                    {/*{<Image src={pageImg.url} alt={"Not Found"} className={"chapter_images"}></Image>}*/}
                </Container>
            </div>
        );
    };

    return (
        <div>
            <Container>
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
            </Container>
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
    };

    function FindPrevChapter(){
        if(context.state.curChapter.listId - 1 < 0){
            return context.state.curChapter;
        }
        for(let idx = context.state.curChapter.listId - 1; idx >= 0; --idx){
            if(parseInt(context.state.chapterList[idx].data.attributes.chapter, 10) < parseInt(context.state.curChapter.data.attributes.chapter, 10)){
                return context.state.chapterList[idx];
            }
        }
    };

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
};

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