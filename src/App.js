import './App.css';
import {React, Component} from 'react'
import api from './api'
import apiResp from './apiResp'

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false, 
      ...apiResp.createMangaResponse()
    }
  }

  componentDidMount(){
    api.getRandomManga()
    .then((response) => {
      console.log(response.data)
      this.setState({
        isLoaded: true,
        respID: response.data.data.id,
        respType: response.data.data.type,
        respAttr: response.data.data.attributes
      });
    })
    .catch((error) => {
      console.log(error)
      this.setState({
        isLoaded: false,
        error
      });
    })
    
  }

  render() {
    return (
      <div>
        <h1>{this.state.respAttr.title.en}</h1>
        <p>{this.state.respAttr.description.en}</p>
      </div>
    )
  }

}
 
export default App;
