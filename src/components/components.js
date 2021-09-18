import Button from 'react-bootstrap/Button'
import Routes from "../Routes";
import React from "react";
import {Nav, Navbar, Container, Image, Form} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap"
import {useHistory} from "react-router-dom";
import logo from "../images/logo.png";
import { slide as Menu } from "react-burger-menu";
import './components.css'

const SearchBar = ({onChange, placeholder, onClick, onClickRand, onKeyDown}) => {
    const history = useHistory();
    const gotoAdvancedSearch = () => {
        history.push(`/AdvancedSearch`);
    };

    return (
        <div className="Search">
            <span className="SearchSpan">
            </span>
            <input
            size={75}
            className="SearchInput"
            type="text"
            onChange={onChange}
            placeholder={placeholder}
            style={{height:37}}
            onKeyDown={onKeyDown}
            />
            <br/>
            <Button variant="primary" onClick={onClick} type="submit" style={{marginTop:20, marginBottom:20}}>Search</Button>
            <Button variant="primary"  onClick={onClickRand} type="submit" style={{marginLeft:10, marginTop:20, marginBottom:20}}>Random</Button>
            <Button variant={"secondary"} onClick={gotoAdvancedSearch} style={{marginLeft:10}}>Advanced Search</Button>
        </div>
    );
  };

const TopBar = () => {
    return (
      <div>
          <Container>
              <Navbar bg={"light"} expand={"lg"}>
                  <LinkContainer to={"/"}>
                      <Navbar.Brand>
                          <Image
                              src={logo}
                              width={"40"}
                              height={"40"}
                              style={{marginRight:10, marginLeft:10}}
                          />
                          Manga Lib
                      </Navbar.Brand>
                  </LinkContainer>
              </Navbar>
          </Container>
      </div>
    );
};

const TopNavBar = () => {
    const initialSearchState = {
        title:"",
        status:[],
        publicationDemographic:[],
        includedTags:[],
        excludedTags:["b13b2a48-c720-44a9-9c77-39c9979373fb"],
        contentRating:[]
    };
    const [history, setHistory] = React.useState(useHistory());
    const [searchObject, setSearchObject] = React.useState(initialSearchState);
    const gotoAdvancedSearch = () => {
        history.push(`/AdvancedSearch`);
    };
    const handleChange = (e) => {
        setSearchObject({...searchObject, [e.target.name]: e.target.value});
    };
    const TopNavBarSearch = () => {
        history.push({pathname:`/`, state:{searchObject:searchObject}});
    };
    const TopNavBarRandSearch = () => {
        history.push({pathname:`/`, state:{searchObject:{...searchObject, rand: true}}})
    };
    React.useEffect(()=>{console.log(searchObject);},[searchObject])

    return (
        <div>
            <Container>
                <Navbar bg={"light"} expand={"lg"}>
                    <LinkContainer to={"/"}>
                        <Navbar.Brand>
                            <Image
                                src={logo}
                                width={"40"}
                                height={"40"}
                                style={{marginRight:10, marginLeft:10}}
                            />
                            Manga Lib
                        </Navbar.Brand>
                    </LinkContainer>
                    <span className="SearchSpan">
                    </span>
                    <Form onSubmit={TopNavBarSearch}>
                        <Form.Group controlId={"title"}>
                            <Form.Control type={"text"} name={"title"} placeholder={"Find a Manga!"} onChange={handleChange}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" >Search</Button>
                        <Button variant="primary" onClick={TopNavBarRandSearch}>Random</Button>
                        <Button variant={"secondary"} onClick={gotoAdvancedSearch}>Advanced Search</Button>
                    </Form>
                </Navbar>
            </Container>
        </div>
    );
};

const SampleText = () => {
    return (
        <p> lorem ipsum</p>
    )
};


const components = {SearchBar, TopNavBar, TopBar, SampleText}
export default components;

//<button onClick={onClick} type="submit"><i class="fa fa-search"></i></button>