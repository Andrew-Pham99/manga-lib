import React, {useEffect} from 'react'
import api from './api'
import components from './components/components'
import {useLocation, Link} from 'react-router-dom'
import './MangaInfo.css'
import {Navbar, Nav, Container} from "react-bootstrap";

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
                            <Link to={{pathname:`/Reader/manga=${context.state.id}/chapter=${chapter.data.attributes.chapter}`, state:{manga:context.state, curChapter:chapter}}}>
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
            <Container>
                <h1>{context.state.name}</h1>
                <img src={context.state.img} width={250} alt={"Not Found"} />
                <ChapterListNav/>
            </Container>
        </div>
    );
};

export default MangaInfo;