import React from "react"
import api from "./api"
import {useLocation} from "react-router-dom";
import {Container, Image} from "react-bootstrap";

function ChapterImages() {
    const [context, setContext] = React.useState(useLocation());
    const [chapterImgUrlList, setChapterImgUrlList] = React.useState([]);
    const getChapterImages = (chapterId) => {
        setChapterImgUrlList([])
        api.getBaseUrl(chapterId)
            .then((getBaseUrlResponse) => {
                console.log(getBaseUrlResponse)
                context.state.curChapter.data.attributes.data.forEach((chapterImg, index) => {
                    setChapterImgUrlList(chapterImgUrlList => [...chapterImgUrlList, api.getChapterImgUrl(getBaseUrlResponse.data.baseUrl, 'data', context.state.curChapter.data.attributes.hash, chapterImg)])
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    React.useEffect(() => {getChapterImages(context.state.curChapter.data.id);}, [])
    React.useEffect(() => console.log(chapterImgUrlList), [chapterImgUrlList]) // Logs every time the url list updates, remove if annoying

    return (
        <div>
            <Container>
                {chapterImgUrlList.map((chapterImg, index) => (
                    <Image src={chapterImg} key={index} alt={"Not Found"}></Image>
                ))}
            </Container>
        </div>
    )
}

function Reader() {
    const [context, setContext] = React.useState(useLocation());
    console.log(context)
    return (
      <div className={"Reader"}>
          <Container>
            <h1>You are reading {context.state.manga.name} Chapter {context.state.curChapter.data.attributes.chapter}</h1>
            <ChapterImages/>
          </Container>
      </div>
    );
}

export default Reader;