import './App.css';
import React from 'react'
import Button from 'react-bootstrap/Button'
import api from './api'
import apiResp from './apiResp'
import {Container} from "react-bootstrap";

function SearchBar(){
    const [searchQuery, setSearchQuery] = React.useState();
    const[responseData, setResponseData] = React.useState([]);

    const handleChange = e => {
        setSearchQuery(e.target.value)
    }

    const handleInput = e => {
        api.queryManga({title: searchQuery})
        .then((response) => {
            setResponseData(response.data)
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
    setSearchQuery('')
    }

    return(
        <div class="container">
            <h1>Manga Lib</h1>
            <input size={60} type='text' placeholder='Find a Manga!' onChange={handleChange}/>
            <Button onClick={handleInput}>Search</Button>
        </div>
    );
}

function App() {

    return (
      <div className="search-manga">
          <Container>
            <SearchBar/>
          </Container>
      </div>
    );
};
 
export default App;
