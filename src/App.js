import './App.css';
import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card';
import api from './api'
import components from './components/components'
import apiResp from './apiResp'
import {Container} from "react-bootstrap";
import Grid from '@material-ui/core/Grid'

// Remove this when you no longer need a placeholder image
import placeholderImage from "./images/Broda.jpg"


function MangaCard(props){
    // For this to work you need to add 2 props: description and img from the api
    // I can add onClick functions to handle the view transformation with you want to keep everything
    //  on the same page, or we can have the button route to a new page.
    return(
        <Card style={{width: '25rem', marginLeft:10, marginBottom:10}}>
            <Card.Img variant={"top"} src={props.img} alt={"No Image Found"} className={"thumbnail"} width={100}/>
            <Card.Body>
                <Card.Title>
                    {props.name}
                </Card.Title>
                <Card.Text>
                    <div style={{overflowY:"auto", height:200, textAlign:"center"}}>
                    <p style={{fontSize:"smaller"}}>{props.description}</p>
                    </div>
                </Card.Text>
            </Card.Body>
            <Button variant={"primary"}>
                Read {props.name}
            </Button>
        </Card>
    );
}

function SearchBar(props){
    const [searchQuery, setSearchQuery] = React.useState();
    const[responseData, setResponseData] = React.useState([]);
    const[offset, setOffset] = React.useState(0);
    const[showButton, setShowButton] = React.useState(false);


    const[imgUrl, setImg] = React.useState()
    const[imgId, setImgId] = React.useState();
    const[fileName, setFileName] = React.useState();
    const[mangaId, setMangaId] = React.useState();

    const handleChange = e => {
        setSearchQuery(e.target.value)

    }

    const handleInput = e => {
        setOffset(30)
        setShowButton(false)
        api.queryManga({title: searchQuery})
        .then((response) => {
            setResponseData(response.data.results)
            console.log(response.data)
            setMangaId(response.data.results[0].data.id)
            if(response.data.results.length < api.limit || response.data.offset + api.limit === response.data.total) {
                setShowButton(false) 
            }
            else {setShowButton(true)}
            response.data.results[0].relationships.forEach(element => {
                if(element.type == "cover_art") {
                    setImgId(element.id)
                    console.log("ELEMENT ID " + element.id) //Cover art ID
                    api.getCoverArt(element.id)
                    .then((CoverResponse) => {
                        console.log("COVER SUCCESS")
                        console.log("COVER FILENAME " + CoverResponse.data.data.attributes.fileName)
                        console.log("MANGA_ID " + response.data.results[0].data.id)
                        console.log(`https://uploads.mangadex.org/covers/${response.data.results[0].data.id}/${CoverResponse.data.data.attributes.fileName}`)
                        setImg(`https://uploads.mangadex.org/covers/${response.data.results[0].data.id}/${CoverResponse.data.data.attributes.fileName}`)
                    })
                    .catch((CoverError) => {
                        console.log("COVER FAIL")
                        console.log("Error Cover Art")
                        console.log(CoverError)
                    })
                }
            })
                    
        })
        .catch((error) => {

            console.log(error)
        })


      
    }

    const onEnter = e => {  
        if (e.key === 'Enter'){
            setOffset(30)
            setShowButton(false)
            api.queryManga({title: searchQuery})
            .then((response) => {
                setResponseData(response.data.results)
                console.log(response.data)
                if(response.data.results.length < api.limit || response.data.offset + api.limit === response.data.total) {
                    setShowButton(false)
                }
                else {setShowButton(true)}
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }

    const loadMore = e => {
        setOffset(offset+30)
        console.log('loading more...')
        console.log(offset)
        api.queryManga({title: searchQuery, offset:offset})
        .then((response) => {
            setResponseData(responseData.concat(response.data.results))
            if(response.data.results.length < api.limit || response.data.offset + api.limit === response.data.total) {
                setShowButton(false)
            }
            console.log(responseData)
        })
        .catch((error) => {
            console.log(error)
        })

    }


    return(
        <div>
            <components.SearchBar
            placeholder="Find a Manga!"
            onChange={handleChange}
            onClick={handleInput}
            onKeyDown={onEnter}
            />
            <ul>
                <Grid container className="recipe-space" spacing={3}>
                    <Grid item md={12}>
                        <Grid container justify="center" spacing={0.05}>
                            {responseData.map((item,index) =>(
                                console.log("imageurl " + imgUrl),
                            <MangaCard
                                key={index}
                                name={item.data.attributes.title.en}
                                img={imgUrl}
                                description={item.data.attributes.description.en}
                            />
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </ul>
            <button onClick={loadMore} style={{visibility: showButton ? 'visible' : 'hidden' }}>
                Load More
            </button>
            
        </div>
    );
}

//"https://uploads.mangadex.org/covers/8f3e1818-a015-491d-bd81-3addc4d7d56a/4113e972-d228-4172-a885-cb30baffff97.jpg.256.jpg"
function App() {

    return (
      <div className="search-manga">
          <h1>Manga Lib</h1>
          <Container>
            <SearchBar/>
          </Container>
      </div>
    );
};
 
export default App;
