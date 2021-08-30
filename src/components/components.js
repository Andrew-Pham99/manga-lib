import Button from 'react-bootstrap/Button'
import Routes from "../Routes";
import React from "react";
import {Nav, Navbar, Container, Image} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap"

const SearchBar = ({onChange, placeholder, onClick, onClickRand, onKeyDown}) => {
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
      </div>
    );
  };

const TopNavBar = ({onChange, placeholder, onClick, onClickRand, onKeyDown}) => {
    return (
        <div>
            <Container>
                <Navbar bg={"light"} expand={"lg"}>
                    <LinkContainer to={"/"}>
                        <Navbar.Brand>
                            <Image
                                src={""}
                                width={"30"}
                                height={"30"}
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
                        onChange={onChange}
                        placeholder={placeholder}
                        style={{height:37}}
                        onKeyDown={onKeyDown}
                    />
                    <Button variant="primary" onClick={onClick} type="submit" style={{marginLeft:10, marginTop:20, marginBottom:20}}>Search</Button>
                    <Button variant="primary"  onClick={onClickRand} type="submit" style={{marginLeft:10, marginTop:20, marginBottom:20}}>Random</Button>
                </Navbar>
            </Container>
        </div>
    )
}

const SampleText = () => {
    return (
        <p> lorem ipsum</p>
    )
}

const components = {SearchBar, TopNavBar, SampleText}
export default components;

//<button onClick={onClick} type="submit"><i class="fa fa-search"></i></button>