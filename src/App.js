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
        <Card style={{width: '25rem'}}>
            <Card.Img variant={"top"} src={props.img} alt={"No Image Found"} className={"thumbnail"} width={"350px"}/>
            <Card.Body>
                <Card.Title>
                    <h1>{props.name}</h1>
                </Card.Title>
                <Card.Text>
                    <p>{props.description}</p>
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
    const[len, setLen] = React.useState(0)
    
    const handleChange = e => {
        setSearchQuery(e.target.value)

    }

    const handleInput = e => {
        setOffset(30)
        setShowButton(true)
        api.queryManga({title: searchQuery})
        .then((response) => {
            setResponseData(response.data.results)
            console.log(response.data)
            if(response.data.results.length < api.limit || response.data.offset + api.limit === response.data.total) {
                setShowButton(false) 
            }
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
    
    }

    const onEnter = e => {  
        if (e.key === 'Enter'){
            setOffset(30)
            setShowButton(true)
            api.queryManga({title: searchQuery})
            .then((response) => {
                setResponseData(response.data.results)
                console.log(response.data)
                if(response.data.results.length < api.limit || response.data.offset + api.limit == response.data.total) {
                    setShowButton(false)
                }
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }
    const reset = e => {
        setResponseData([])
    }

    const loadMore = e => {
        setOffset(offset+30)
        console.log('loading more...')
        console.log(offset)
        api.queryManga({title: searchQuery, offset:offset})
        .then((response) => {
            setResponseData(responseData.concat(response.data.results))
            if(response.data.results.length < api.limit || response.data.offset + api.limit == response.data.total) {
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
                <Grid container className="recipe-space" spacing={2}>
                    <Grid item md={8}>
                        <Grid container justify="center" spacing={1}>
                            {responseData.map((item,index) =>(
                            <MangaCard
                                key={index}
                                name={item.data.attributes.title.en}
                                img={placeholderImage}
                                description={"This is a placeholder description"}
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
