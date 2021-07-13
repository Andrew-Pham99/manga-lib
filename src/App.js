import './App.css';
import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card';
import api from './api'
import components from './components/components'
import apiResp from './apiResp'
import {Container} from "react-bootstrap";
import Grid from '@material-ui/core/Grid'


function MangaCard(props){
    return(
        <Card style={{width: '25rem'}}>
        <Card.Body>
            <Card.Title>{props.name}</Card.Title>
        </Card.Body>
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
        setShowButton(false)
        api.queryManga({title: searchQuery})
        .then((response) => {
            setResponseData(response.data.results)
            console.log(response.data)
            if(response.data.results.length < api.limit || response.data.offset + api.limit === response.data.total) {
                setShowButton(false) 
            }
            else {setShowButton(true)}
            console.log(response.data)
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
                if(response.data.results.length < api.limit || response.data.offset + api.limit == response.data.total) {
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
                    <Grid item md={12}>
                        <Grid container justify="center" spacing={.05}>
            {responseData.map((item,index) =>(
                <MangaCard
                    key={index}
                    name={item.data.attributes.title.en}
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
