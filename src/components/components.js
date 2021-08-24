import Button from 'react-bootstrap/Button'
import Routes from "../Routes";
import React from "react";

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

const SampleText = () => {
    return (
        <p> lorem ipsum</p>
    )
}

const components = {SearchBar, SampleText}
export default components;

//<button onClick={onClick} type="submit"><i class="fa fa-search"></i></button>