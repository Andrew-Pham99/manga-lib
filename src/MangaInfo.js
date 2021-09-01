import React, {useEffect} from 'react'
import api from './api'
import components from './components/components'
import {useLocation, useHistory, Link} from 'react-router-dom'
import './MangaInfo.css'
import {Navbar, Nav, Container} from "react-bootstrap"
import {Card,Row, Col} from 'react-bootstrap'



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
    const getChapterList = () => {
        setChapterList([])
        api.getChapterList({manga: context.state.id})
            .then((getChapterListResponse) => {
                console.log(getChapterListResponse)
                setChapterList(chapterList => getChapterListResponse.data.results);
            })
            .catch((error) => {
                console.log(error)
            })
    }
    React.useEffect(() => {getChapterList();}, []);
    React.useEffect(() => console.log(chapterList), [chapterList]) // Logs every time the chapter list updates, remove if annoying


    return (
        <div >
            <Navbar  className="ChapterList">
                <Nav className={"flex-column"}>
                {chapterList.map((chapter, index) => (
                    <Nav.Item key={index}>
                        <Nav.Link>
                            <Link className="chapter" to={{pathname:`/Reader/manga=${context.state.id}/chapter=${chapter.data.attributes.chapter}`, state:{manga:context.state, curChapter:chapter, chapterList:chapterList}}}>
                                {chapter.data.attributes.title !== "" ? `Chapter ${chapter.data.attributes.chapter} - ${chapter.data.attributes.title}` :
                                    `Chapter ${chapter.data.attributes.chapter}`}
                            </Link>
                        </Nav.Link>
                    </Nav.Item>
                ))}
                </Nav>
            </Navbar>
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