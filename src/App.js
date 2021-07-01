import './App.css';
import React from 'react'
import Button from 'react-bootstrap/Button'
import api from './api'
import apiResp from './apiResp'
import {Container} from "react-bootstrap";

function SearchBar(){
    const [searchQuery, setSearchQuery] = React.useState();

    const handleChange = e => {
        setSearchQuery(e.target)
    }

    const handleInput = e => {

        setSearchQuery('')
    }

    return(
        <div>
            <input size={60} type='text' placeholder='Find a Manga!' onChange={handleChange}/>
            <Button onClick={handleInput}>Search</Button>
        </div>
    );
}

function App() {
  
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     isLoaded: false,
  //     ...apiResp.createMangaResponse()
  //   }
  // }
  //
  // componentDidMount(){
  //   api.getRandomManga()
  //   .then((response) => {
  //     console.log(response.data)
  //     this.setState({
  //       isLoaded: true,
  //       respID: response.data.data.id,
  //       respType: response.data.data.type,
  //       respAttr: response.data.data.attributes
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //     this.setState({
  //       isLoaded: false,
  //       error
  //     });
  //   })
    
  //}

    return (
      <div>
          <Container>
            <SearchBar></SearchBar>
          </Container>
      </div>
    );
};
 
export default App;
