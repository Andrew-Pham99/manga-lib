import React, {useEffect} from 'react'
import api from './api'
import components from './components/components'
import {useLocation, useHistory, Link} from 'react-router-dom'
import './MangaInfo.css'
import {Navbar, Nav, Container} from "react-bootstrap"
import {Card,Row, Col} from 'react-bootstrap'
import ReactPaginate from 'react-paginate';


function Info(props) {
    return(
        <Card width={300} style={{marginTop:20}}>
            <Row >
                <Col xs={6} md={3}>
                    <Card.Img  src={props.img} rounded ></Card.Img>
                </Col>
                <Col>
                    <Card.Body variant="right">
                        <Card.Title style={{fontSize:32}}>{props.title}</Card.Title>
                        <Card.Text>{props.description}</Card.Text>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    )
}

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
                getChapterListResponse.data.results.forEach((chapter, index) => {
                    setChapterList(chapterList => [...chapterList, {data:chapter.data, relationships: chapter.relationships, result:chapter.result, listId:index}])
                })
                console.log(getChapterListResponse)
                setPageLength(Math.ceil(getChapterListResponse.data.total/api.ch_limit))
                if(Math.ceil(getChapterListResponse.data.total/api.ch_limit) > 1)
                {
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
                setChapterList(chapterList => getChapterListResponse.data.results)
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
            activeClassName={"active"}/>      


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
                activeClassName={"active"}/>  
            
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
                title={context.state.name}/>
                <ChapterListNav/>
            </Container>
        </div>
    );
};

export default MangaInfo;