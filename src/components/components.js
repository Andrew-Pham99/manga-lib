import React from "react";
import {Navbar, Container, Button, Image, Form, Row, Col, Spinner} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap"
import {useHistory, Link} from "react-router-dom";
import logo from "../images/logo.png";
import '../css/components.css';
import '../css/standard_styles.css'

const SearchBar = ({onChange, placeholder, onClick, onClickRand, onKeyDown}) => {
    const history = useHistory();
    const gotoAdvancedSearch = () => {
        history.push(`/AdvancedSearch`);
    };
    const gotoAdvancedSearchNewTab = (event) => {
        if(event.button === 1){
            window.open(`/AdvancedSearch`);
        }
    };

    return (
        <div className={"search-bar"}>
            <Container className={"w-50"}>
                <input
                    size={75}
                    className={"search-bar-field form-control"}
                    type={"text"}
                    onChange={onChange}
                    placeholder={placeholder}
                    onKeyDown={onKeyDown}
                />
            </Container>
            <br/>
            <Button onClick={onClick} type="submit" className={"button-themed button-format"}>Search</Button>
            <Button onClick={onClickRand} type="submit" className={"button-themed button-format"}>Random</Button>
            <Button variant={"secondary"} onClick={gotoAdvancedSearch} onMouseDown={gotoAdvancedSearchNewTab} className={"button-format"}>Advanced Search</Button>
        </div>
    );
  };

const TopBar = () => {
    return (
      <div>
          <Container className={"row nowrap d-inline-block position-relative"}>
              <Navbar expand={"lg"} className={"top-bar"}>
                  <LinkContainer to={"/"}>
                      <Navbar.Brand className={"text"}>
                          <Image
                              src={logo}
                              className={"image"}
                          />
                          Manga Oyasumi
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
    const history = useHistory();
    const [searchObject, setSearchObject] = React.useState(initialSearchState);
    const gotoAdvancedSearch = () => {
        history.push(`/AdvancedSearch`);
    };
    const gotoAdvancedSearchNewTab = (event) => {
        if(event.button === 1){
            window.open(`/AdvancedSearch`);
        }
    };
    const handleChange = (e) => {
        setSearchObject({...searchObject, [e.target.name]: e.target.value});
    };
    const TopNavBarSearch = () => {
        history.push({pathname:`/`, state:{searchObject:searchObject}});
    };
    const TopNavBarSearchNewTab = (event) => {
        if(event.button === 1){
            localStorage.setItem("SEARCH_STATE", JSON.stringify({searchObject:searchObject}));
            window.open(`/`);
        }
    };
    const TopNavBarRandSearch = () => {
        history.push({pathname:`/`, state:{searchObject:{...searchObject, rand: true}}});
    };
    const TopNavBarRandSearchNewTab = (event) => {
        if(event.button === 1){
            localStorage.setItem("SEARCH_STATE", JSON.stringify({searchObject:{...searchObject, rand:true}}));
            window.open(`/`);
        }
    }
    React.useEffect(()=>{console.log(searchObject);},[searchObject])

    return (
        <div>
            <Container className={"row nowrap d-inline-block"}>
                <Navbar expand={"lg"} className={"top-bar"} >
                    <LinkContainer to={"/"}>
                        <Navbar.Brand className={"text"}>
                            <Image
                                src={logo}
                                className={"image"}
                            />
                            Manga Oyasumi
                        </Navbar.Brand>
                    </LinkContainer>
                    <Form onSubmit={TopNavBarSearch} className={"flex-fill"}>
                        <Row>
                            <Col className={"flex-grow-1"}>
                                <Form.Group controlId={"title"} className={"flex-fill"}>
                                    <Form.Control type={"text"} name={"title"} placeholder={"Find a Manga!"} onChange={handleChange} className={"search-bar-field"}/>
                                </Form.Group>
                            </Col>
                            <Col lg={"auto"}>
                                <Button className={"button-themed"} type="submit" onMouseDown={TopNavBarSearchNewTab}>Search</Button>
                            </Col>
                            <Col lg={"auto"}>
                                <Button className={"button-themed"} onClick={TopNavBarRandSearch} onMouseDown={TopNavBarRandSearchNewTab}>Random</Button>
                            </Col>
                            <Col lg={"auto"}>
                                <Button variant={"secondary"} onClick={gotoAdvancedSearch} onMouseDown={gotoAdvancedSearchNewTab}>Advanced Search</Button>
                            </Col>
                        </Row>
                    </Form>
                </Navbar>
            </Container>
        </div>
    );
};

const AboutUs = () => {
    return (
        <div>
            <Container className={"fixed-bottom"} fluid>
                <Link to={`/About`}>
                    <p className={"aboutUs"}>About Us</p>
                </Link>
            </Container>
        </div>
    );
};

const LoadingSpinner = () => {
    return (
        <Container align={"center"}>
            <Spinner animation={"border"} role={"status"} className={"spinner-themed"}>
                <span className={"visually-hidden"}>Loading...</span>
            </Spinner>
        </Container>
    );
};

const components = {SearchBar, TopNavBar, TopBar, LoadingSpinner, AboutUs}
export default components;