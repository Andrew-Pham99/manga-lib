import React from 'react'
import api from './api'
import components from './components/components'
import {useLocation, useHistory} from 'react-router-dom'
import './css/MangaInfo.css'
import {Navbar, Nav, Container, Spinner} from "react-bootstrap"
import {Card,Row, Col} from 'react-bootstrap'
import ReactPaginate from 'react-paginate';
import { isTaggedTemplateExpression } from 'typescript'


function Info(props) {
    const [history, setHistory] = React.useState(useHistory());
    const [searchObject, setSearchObject] = React.useState({
        title:"",
        status:[],
        publicationDemographic:[],
        includedTags:[],
        excludedTags:[],
        contentRating:[],
        authors:[]
    })
    let author = [], artist = [], themes = [], genres = [], format = [], tagId = [],
        themeId = [], genreId = [], formatId = [], authId = [], artId = [];

    props.relationships.forEach(element => {
        if(element.type === "author"){

            author.push(element.attributes ? element.attributes.name: 'N/A')
            authId.push(element.id)
        }
        if(element.type === "artist"){
            artist.push(element.attributes ? element.attributes.name: 'N/A')
            artId.push(element.id)
        }
    })
    props.tags.forEach(tag => {
        if(tag.attributes.group === "theme"){
            themes.push(tag.attributes.name.en)
            themeId.push(tag.id)
        }
        if(tag.attributes.group === "genre"){
            genres.push(tag.attributes.name.en)
            genreId.push(tag.id)
            
        }
        if(tag.attributes.group === "format"){
            format.push(tag.attributes.name.en)
            tagId.push(tag.id)
            formatId.push(tag.id)
        }
    })
    tagId = themeId.concat(genreId, formatId)

    const handleSearch = (id, type) => {
        history.push({pathname:"/", state:{searchObject: {[type]: [id]}, order:"followedCount"}})
    }

    return(
        <Card className={"info-card"}>
            <Row>
                <Col md={3} sm={6}>
                    <Card.Img className={"rounded"}  src={props.img}/>
                </Col>
                <Col>
                    <Card.Body variant="right" className="card_body">
                        <Card.Title style={{fontSize:32, marginBottom:10}} className={"text-color"}>{props.title}</Card.Title>
                        <Card.Subtitle className={"text-color"}>Publication Status:</Card.Subtitle>
                        <Card.Text className={"text-color"}>{props.status.charAt(0).toUpperCase() + props.status.slice(1)}</Card.Text>
                        <Card.Subtitle className={"text-color"}>Author(s):</Card.Subtitle>
                    
                        {
                        author.map((auth, index) => {
                            return <span onClick={() => handleSearch(authId[index], "authors")} key={`demo_snap_${index}`} className={"text-color"}>
                                    <span>{(index ? ', ' : '')}</span>
                                    <span className="clickable tag">{auth}</span>
                                </span>
                        })
                        }
                        <div style={{margin:"1rem"}}/>
                        <Card.Subtitle className={"text-color"}>Artist(s):</Card.Subtitle>
                        {
                        author.map((auth, index) => {
                            return <span onClick={() => handleSearch(artId[index], "artists")} key={`demo_snap_${index}`} className={"text-color"}>
                                    <span>{(index ? ', ' : '')}</span>
                                    <span className="clickable tag">{auth}</span>
                                </span>
                        })
                        }
                        <div style={{margin:"1rem"}}/>
                        <Card.Subtitle className={"text-color"}>Description:</Card.Subtitle>
                        <Card.Text className={"text-color"}>
                        {props.description}
                        </Card.Text>
                        <Card.Subtitle style={{fontSize:"smaller"}} className={"text-color"}>Tags:</Card.Subtitle>
                        {
                        themes.concat(genres,format).map( (tag,index) => {
                                return <span   onClick={() => handleSearch(tagId[index], "includedTags")} style={{fontSize:"smaller"}}key={`demo_snap_${index}`} className={"text-color"}>
                                            <span>{(index ? ', ' : '')}</span>
                                            <span className="clickable tag">{tag}</span>
                                        </span>

                            })
                        }
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    )
}

function ChapterListNav(props) {
    const context = useLocation();
    const history = useHistory();
    const [chapterList, setChapterList] = React.useState([]);
    const [pageLength, setPageLength] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [pageVis, setPageVis] = React.useState(false);
    const [bottomPageVis, setBottomPageVis] = React.useState(false);
    const [noChapters, setNoChapters] = React.useState(false);
    const chapterSort = (a, b) => {
        let aChapter = parseFloat(a.data.attributes.chapter), bChapter = parseFloat(b.data.attributes.chapter);
        if(aChapter < bChapter){
            return -1;
        }
        if(aChapter > bChapter){
            return 1;
        }
        return 0;
    };

    const getChapterList = () => {
        let totalChapters, chaptersFetched = 0, remainingChaptersToFetch, offset = 100, totalOffset = 0;
        setChapterList([]);
        setNoChapters(false);
        api.getChapterList({manga: props.id})
            .then((getChapterListResponse) => {
                console.log(getChapterListResponse);
                if(getChapterListResponse.data.data.length === 0){
                    setNoChapters(true);
                    return;
                }

                totalChapters = getChapterListResponse.data.total;
                chaptersFetched += getChapterListResponse.data.data.length;
                remainingChaptersToFetch = totalChapters - chaptersFetched;
                totalOffset += offset;
                console.log("Total Chapters: " + (totalChapters) + "; Chapters Fetched: " + (chaptersFetched) + "; Remaining Chapters: " + (remainingChaptersToFetch) + ";");

                getChapterListResponse.data.data.forEach((chapter, index) => {
                    setChapterList(chapterList => [...chapterList, {data:chapter, relationships: chapter.relationships, result:chapter.result, listId:(index)}])
                })
                for(let i = 1; i < Math.ceil(remainingChaptersToFetch / chaptersFetched) + 1; i++){
                    let thisOffset = totalOffset;
                    api.getChapterList({manga: props.id, offset: totalOffset})
                        .then((nextChapterListResponse) => {
                            console.log(nextChapterListResponse);
                            nextChapterListResponse.data.data.forEach((chapter, index) => {
                                setChapterList(chapterList => [...chapterList, {data:chapter, relationships:chapter.relationships, result:chapter.result, listId:(index + thisOffset)}]);
                            })
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                    totalOffset += offset;
                }
                setChapterList(chapterList => chapterList.sort((a,b) => {chapterSort(a,b)}));

                let pageLengthVal = Math.ceil(getChapterListResponse.data.total/api.ch_limit);
                setPageLength(pageLengthVal);
                if(pageLengthVal >= 1) {
                    setPageVis(true);
                    setBottomPageVis(true);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    };
    React.useEffect(() => {getChapterList();}, []);

    const handlePageClick = (e) => {
        setBottomPageVis(false)
        const selectedPage = e.selected;
        setCurrentPage(selectedPage)
        setBottomPageVis(true)
    }
    const handleChapterChange = (chapter, history) => {
        history.push({pathname:`/Reader/manga=${props.id}/chapter=${chapter.data.attributes.chapter}`, state:{manga:props.state, curChapter:chapter, chapterList:chapterList}});
    };
    const handleMouseDown = (event, chapter, context) => {
        if(event.button === 1){
            localStorage.setItem("READER_STATE", JSON.stringify({manga:props.state, curChapter:chapter, chapterList:chapterList}))
            window.open(`/Reader/manga=${props.id}/chapter=${chapter.data.attributes.chapter}`)
        }
    };

    return (
        <div>
            {noChapters ?
                <p className={"text-color"} style={{marginTop:30}}>No chapters could be found</p>
                :
                (pageVis ?
                    <div>
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            initialPage={0}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            pageCount={pageLength}
                            forcePage={currentPage}
                            containerClassName={(pageVis? "pagination" : "pagination hidden"  )}
                            onPageChange={handlePageClick}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                            disableInitialCallback={"true"}/>
                        <Navbar  className="ChapterList">
                            <Nav className={"flex-column"}>
                                {chapterList.sort((a, b) => chapterSort(a, b)).slice((currentPage * api.ch_limit),((currentPage * api.ch_limit) + api.ch_limit)).map((chapter, index) => (
                                    <Nav.Item key={index}  onClick={() => handleChapterChange(chapter,  history)} onMouseDown={(event) => handleMouseDown(event, chapter)}>
                                        <Nav.Link className={"chapter"}>
                                            {chapter.data.attributes.title !== "" ? `Chapter ${chapter.data.attributes.chapter} - ${chapter.data.attributes.title}` :
                                                `Chapter ${chapter.data.attributes.chapter}`}
                                        </Nav.Link>
                                    </Nav.Item>
                                ))}
                            </Nav>
                        </Navbar>
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            initialPage={0}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            pageCount={pageLength}
                            forcePage={currentPage}
                            containerClassName={(pageVis && bottomPageVis? "pagination" : "pagination hidden" )}
                            onPageChange={handlePageClick}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                            disableInitialCallback={"true"}/>
                    </div>
                    :
                    <components.LoadingSpinner/>
                )
            }
        </div>
    );
}


function ApiInfo(){
    const [loading, setLoading] = React.useState(true)
    const [err, setErr] = React.useState(false)
    const history = useHistory();
    const [context, setContext] = React.useState(useLocation());
    const [test, setTest] = React.useState(false)
    const [mInfo, setMInfo] = React.useState( {
        description:"",
        img:"",
        title:"",
        status:"",
        demographic:"",
        relationships:[],
        tags:[]
    })

    const match = RegExp("(\/Info\/)(manga=)?(.*)", "i").exec(history.location.pathname)
    const id = match[match.length-1]

    const loadInfo = () => {
        api.getManga(id)
        .then((response)=>{
            console.log("SUCCESS!")
            setLoading(false)
            setErr(true)
            let im = ''
            const attributes = response.data.data.attributes
            response.data.data.relationships.forEach(relationship => {
                if (relationship.type === "cover_art") {
                    im= `https://uploads.mangadex.org/covers/${response.data.data.id}/${relationship.attributes.fileName}`;
                }
            })
            setMInfo({
                description:attributes.description.en? attributes.description.en.replace(/[^.]*\[.*/g, ''): '',
                img:im,
                title:attributes.title.en? attributes.title.en:attributes.title.jp,
                status:attributes.status,
                demographic:attributes.publicationDemographic? attributes.publicationDemographic: 'N/A',
                relationships:response.data.data.relationships,
                tags:attributes.tags
            })
        })
        .catch((error)=>{
            setLoading(false)
            setErr(false)
            console.log(error)
        })
    }



    React.useEffect(() => {loadInfo();}, [])


    console.log(loading)
    return(
            <div>
                {
                    loading? 
                        <Container align={"center"} style={{marginTop:30}}>
                            <Spinner animation={"border"} role={"status"} className={"spinner-themed"}>
                                <span className={"visually-hidden"}>Loading...</span>
                            </Spinner>                
                        </Container>
                        :
                        [
                            err?
                                <Container>
                                    <Info
                                    description={mInfo.description}
                                    img={mInfo.img}
                                    title={mInfo.title}
                                    status={mInfo.status}
                                    demographic={mInfo.demographic}
                                    relationships={mInfo.relationships}
                                    tags={mInfo.tags}
                                    />
                                    <ChapterListNav
                                        id = {id}
                                        state={mInfo}
                                    />
                                </Container>
                                :
                                <h3 style={{color:"var(--text-color)", marginTop:20}}>Sorry, this page could not be found!</h3>
                        ]
                }
            </div>
    )
}


function MangaInfo() {
    const context = useLocation();
    if(context.state === undefined || context.state === null){
        if (localStorage.getItem("MANGAINFO_STATE") === null){
            return (
                <div className="MangaInfo">
                    <components.TopNavBar/>
                    <ApiInfo/>
                        
                    
                </div>
            )
        }
        context.state = JSON.parse(localStorage.getItem("MANGAINFO_STATE"));
        localStorage.removeItem("MANGAINFO_STATE");
    }
    console.log("Entering Manga Info");
    return (
        <div className="MangaInfo">

            <components.TopNavBar/>
            <Container>
                <Info
                    description={context.state.description}
                    img={context.state.img}
                    title={context.state.title}
                    status={context.state.status}
                    demographic={context.state.demographic}
                    relationships={context.state.relationships}
                    tags={context.state.tags}
                />
                <ChapterListNav
                    id={context.state.id}
                    state={context.state}
                />
            </Container>
            <components.AboutUs/>
        </div>
    );
};

export default MangaInfo;