import Button from 'react-bootstrap/Button'
import React from "react";
import {Navbar, Container, Image, Form, Row, Col} from "react-bootstrap";
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
        excludedTags:[],
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
            <Container className={"row nowrap d-inline-block"}>
                <Navbar bg={"light"} >
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
                    <Form onSubmit={TopNavBarSearch} className={"flex-fill"}>
                        <Row>
                            <Col className={"flex-grow-1"}>
                                <Form.Group controlId={"title"} className={"flex-fill"}>
                                    <Form.Control type={"text"} name={"title"} placeholder={"Find a Manga!"} onChange={handleChange}/>
                                </Form.Group>
                            </Col>
                            <Col lg={"auto"}>
                                <Button variant="primary" type="submit">Search</Button>
                            </Col>
                            <Col lg={"auto"}>
                                <Button variant="primary" onClick={TopNavBarRandSearch}>Random</Button>
                            </Col>
                            <Col lg={"auto"}>
                                <Button variant={"secondary"} onClick={gotoAdvancedSearch}>Advanced Search</Button>
                            </Col>
                        </Row>
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