import React from 'react'
import api from './api'
import components from './components/components'
import {useLocation, useHistory, Link} from 'react-router-dom'
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


    let author = []
    let artist = []
    let themes = []
    let genres = []
    let format = []
    let tagId = []

    let themeId = []
    let genreId = []
    let formatId = []
    let authId = []
    let artId = []

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
        <Card style={{marginTop:20}}>
            <Row >
                <Col xs={6} md={3}>
                    <Card.Img className="img-fluid rounded"  src={props.img} ></Card.Img>
                </Col>
                <Col>
                    <Card.Body variant="right" className="card_body">
                        <Card.Title style={{fontSize:32, marginBottom:10}}>{props.title}</Card.Title>
                        <Card.Subtitle>Publication Status:</Card.Subtitle>
                        <Card.Text>{props.status.charAt(0).toUpperCase() + props.status.slice(1)}</Card.Text>
                        <Card.Subtitle>Author(s):</Card.Subtitle>
                    
                        {
                        author.map((auth, index) => {
                            return <span onClick={() => handleSearch(authId[index], "authors")} key={`demo_snap_${index}`}>
                                    <span>{(index ? ', ' : '')}</span>
                                    <span className="clickable tag">{auth}</span>
                                </span>
                        })
                        }
                        <Card.Subtitle>Artist(s):</Card.Subtitle>
                        {
                        author.map((auth, index) => {
                            return <span onClick={() => handleSearch(artId[index], "artists")} key={`demo_snap_${index}`}>
                                    <span>{(index ? ', ' : '')}</span>
                                    <span className="clickable tag">{auth}</span>
                                </span>
                        })
                        }
                        <Card.Subtitle>Description:</Card.Subtitle>
                        <Card.Text>
                        {props.description}
                        </Card.Text>
                        <Card.Subtitle style={{fontSize:"smaller"}}>Tags:</Card.Subtitle>
                        {
                        themes.concat(genres,format).map( (tag,index) => {
                                return <span   onClick={() => handleSearch(tagId[index], "includedTags")} style={{fontSize:"smaller"}}key={`demo_snap_${index}`}>
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
/*                        <Card.Text>THEMES: {themes.join(', ')}</Card.Text>
                        <Card.Text>GENRES: {genres.join(', ')}</Card.Text>
                        <Card.Text>FORMAT: {format.join(', ')}</Card.Text>
*/

function ChapterListNav() {
    const [context, setContext] = React.useState(useLocation());
    const [history, setHistory] = React.useState(useHistory());
    const [chapterList, setChapterList] = React.useState([]);
    const [pageLength, setPageLength] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [pageVis, setPageVis] = React.useState(false);
    const [bottomPageVis, setBottomPageVis] = React.useState(false);
    const [noChapters, setNoChapters] = React.useState(false);

    const getChapterList = () => {
        let totalChapters, chaptersFetched = 0, remainingChaptersToFetch, offset = 100, totalOffset = 0;
        setChapterList([]);
        setNoChapters(false);
        api.getChapterList({manga: context.state.id})
            .then((getChapterListResponse) => {
                console.log(getChapterListResponse);
                if(getChapterListResponse.data.data.length == 0){
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
                    api.getChapterList({manga: context.state.id, offset: totalOffset})
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
                setChapterList(chapterList => chapterList.sort());

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
    const handleChapterChange = (chapter, context, history) => {
        history.push({pathname:`/Reader/manga=${context.state.id}/chapter=${chapter.data.attributes.chapter}`, state:{manga:context.state, curChapter:chapter, chapterList:chapterList}});
    };
    const handleMouseDown = (event, chapter, context) => {
        if(event.button == 1){
            localStorage.setItem("READER_STATE", JSON.stringify({manga:context.state, curChapter:chapter, chapterList:chapterList}))
            window.open(`/Reader/manga=${context.state.id}/chapter=${chapter.data.attributes.chapter}`)
        }
    };

    return (
        <div>
            {noChapters ?
                <p>No chapters could be found</p>
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
                                {chapterList.slice((currentPage * api.ch_limit),((currentPage * api.ch_limit) + api.ch_limit)).map((chapter, index) => (
                                    <Nav.Item key={index}  onClick={() => handleChapterChange(chapter, context, history)} onMouseDown={(event) => handleMouseDown(event, chapter, context)}>
                                        <Nav.Link>
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
                    <Container align={"center"} style={{marginTop:30}}>
                        <Spinner animation={"border"} role={"status"} variant={"primary"}>
                            <span className={"visually-hidden"}>Loading...</span>
                        </Spinner>
                    </Container>
                )
            }
        </div>
    );
}

function MangaInfo() {
    const context = useLocation();
    if(context.state == undefined){
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
                    title={context.state.name}
                    status={context.state.status}
                    demographic={context.state.demographic}
                    relationships={context.state.relationships}
                    tags={context.state.tags}
                />
                <ChapterListNav/>
            </Container>
        </div>
    );
};

export default MangaInfo;