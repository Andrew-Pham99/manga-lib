import Button from 'react-bootstrap/Button'
import Routes from "../Routes";
import React from "react";
import {Nav, Navbar, Container, Image} from "react-bootstrap";
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
    const [history, setHistory] = React.useState(useHistory());
    const [searchQuery, setSearchQuery] = React.useState();

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const TopNavBarButtonSearch = () => {
        console.log(searchQuery)
        if(searchQuery == null){
            history.push({pathname:`/`, state:{searchEmptyString:true}})
        }
        else {
            history.push({pathname:`/`, state:{searchQuery:searchQuery}})
        }
    };

    const TopNavBarOnEnterSearch = (e) => {
        if(e.key === 'Enter') {
            console.log(searchQuery);
            if(searchQuery == null){
                history.push({pathname:`/`, state:{searchEmptyString:true}})
            }
            else {
                history.push({pathname:`/`, state:{searchQuery:searchQuery}})
            }
        }
    }

    const TopNavBarRandSearch = () => {
        console.log("Random Search")
        history.push({pathname:`/`, state:{randSearch:true}})
    };

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
                    <input
                        size={75}
                        className="SearchInput"
                        type="text"
                        onChange={handleChange}
                        placeholder={"Find a Manga!"}
                        style={{height:37}}
                        onKeyDown={TopNavBarOnEnterSearch}
                    />
                    <Button variant="primary" onClick={TopNavBarButtonSearch} type="submit" style={{marginLeft:10, marginTop:20, marginBottom:20}}>Search</Button>
                    <Button variant="primary"  onClick={TopNavBarRandSearch} type="submit" style={{marginLeft:10, marginTop:20, marginBottom:20}}>Random</Button>
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