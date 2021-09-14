import React, {useEffect} from 'react'
import api from './api'
import components from './components/components'
import {useLocation, useHistory, Link} from 'react-router-dom'
import './MangaInfo.css'
import {Navbar, Nav, Container} from "react-bootstrap"
import {Card,Row, Col} from 'react-bootstrap'
import ReactPaginate from 'react-paginate';


function Info(props) {
    let author, artist = 'N/A'
    let themes = []
    let genres = []
    let format = []

    props.relationships.forEach(element => {
        if(element.type === "author"){
            author = element.attributes ? element.attributes.name: 'N/A'
        }
        if(element.type === "artist"){
            artist = element.attributes ? element.attributes.name: 'N/A'
        }
    })
    props.tags.forEach(tag => {
        console.log("TAGS HERE:")
        console.log(tag)
        if(tag.attributes.group === "theme"){
            themes.push(tag.attributes.name.en)
        }
        if(tag.attributes.group === "genre"){
            genres.push(tag.attributes.name.en)
        }
        if(tag.attributes.group === "format"){
            format.push(tag.attributes.name.en)
        }
    })

    return(
        <Card style={{marginTop:20}}>
            <Row >
                <Col xs={6} md={3}>
                    <Card.Img class="img-fluid rounded"  src={props.img} ></Card.Img>
                </Col>
                <Col>
                    <Card.Body variant="right" className="card_body">
                        <Card.Title style={{fontSize:32, marginBottom:10}}>{props.title}</Card.Title>
                        <Card.Subtitle>Publication Status:</Card.Subtitle>
                        <Card.Text>{props.status.charAt(0).toUpperCase() + props.status.slice(1)}</Card.Text>
                        <Card.Subtitle>Author(s):</Card.Subtitle>
                        <Card.Text>{author}</Card.Text>
                        <Card.Subtitle>Artist(s):</Card.Subtitle>
                        <Card.Text>{artist}</Card.Text>
                        <Card.Subtitle>Description:</Card.Subtitle>
                        <Card.Text>
                        {props.description}
                        </Card.Text>
                        <Card.Subtitle style={{fontSize:"smaller"}}>Tags:</Card.Subtitle>
                        <Card.Text style={{fontSize:"smaller"}}>{themes.concat(genres,format).join(', ')}</Card.Text>

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
    const [chapterList, setChapterList] = React.useState([]);
    const [pageLength, setPageLength] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [pageVis, setPageVis] = React.useState(false);
    const [bottomPageVis, setBottomPageVis] = React.useState(false);

    const getChapterList = () => {
        setChapterList([])
        api.getChapterList({manga: context.state.id})
            .then((getChapterListResponse) => {
                console.log(getChapterListResponse);
                getChapterListResponse.data.data.forEach((chapter, index) => {
                    setChapterList(chapterList => [...chapterList, {data:chapter, relationships: chapter.relationships, result:chapter.result, listId:index}])
                    console.log("CHAPTER LISTS")
                    console.log(chapterList)
                })
                console.log(getChapterListResponse)
                setPageLength(Math.ceil(getChapterListResponse.data.total/api.ch_limit))
                if(Math.ceil(getChapterListResponse.data.total/api.ch_limit) > 1) {
                    setPageVis(true)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    React.useEffect(() => {getChapterList();}, []);

    const handlePageClick = (e) => {
        setBottomPageVis(false)
        setChapterList([])
        const selectedPage = e.selected;
        setCurrentPage(selectedPage)
        api.getChapterList({manga: context.state.id, offset:selectedPage*api.ch_limit})
            .then((getChapterListResponse) => {
                getChapterListResponse.data.data.forEach((chapter, index) => {
                    setChapterList(chapterList => [...chapterList, {data:chapter, relationships: chapter.relationships, result:chapter.result, listId:index}])
                })
            })
            .catch((error) => {
                console.log(error)
            })
        setBottomPageVis(true)
    }

    


    return (
        <div className>
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
                {chapterList.map((chapter, index) => (
                    <Nav.Item key={index}>
                        <Nav.Link>
                            <Link className="chapter" to={{pathname:`/Reader/manga=${context.state.id}/chapter=${chapter.data.attributes.chapter}`,
                                state:{manga:context.state, curChapter:chapter, chapterList:chapterList}}}>
                                {chapter.data.attributes.title !== "" ? `Chapter ${chapter.data.attributes.chapter} - ${chapter.data.attributes.title}` :
                                    `Chapter ${chapter.data.attributes.chapter}`}
                            </Link>
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
    );
}

function MangaInfo() {
    const [context, setContext] = React.useState(useLocation());
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