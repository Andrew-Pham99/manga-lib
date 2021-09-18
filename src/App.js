import './App.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import api from './api';
import components from './components/components';
import {Container, Spinner} from "react-bootstrap";
import Grid from '@material-ui/core/Grid';
import {Link, useLocation} from 'react-router-dom';

function MangaCard(props){
    const [vis, setVis] = React.useState(false)

    const onLoad = () => {
        setVis(true)
    }
    return(
        <Card style={vis?{width: '25rem', marginLeft:10, marginBottom:10}:{width: '25rem', marginLeft:10, marginBottom:10, visibility:'visible'}} key={props.key} id={props.id}>
            <Card.Img variant={"top"} src={props.img} alt={"No Image Found"} className={"thumbnail"} width={100} height={550} onLoad={onLoad}/>
            <Card.Body>
                <Card.Title>
                    {props.name}
                </Card.Title>
                <Card.Text>
                    <div style={{overflowY:"auto", height:200, textAlign:"center"}}>
                        <p style={{fontSize:"smaller"}}>{props.description}</p>
                    </div>
                </Card.Text>
                <Link to={{pathname:`/Info/manga=${props.id}`, state:props}}>
                    <Button variant={"primary"}>
                        Read {props.name}
                    </Button>
                </Link>
            </Card.Body>
        </Card>
 
    );
}

function SearchBar(){
    const initialSearchState = {
        title:"",
        status:[],
        publicationDemographic:[],
        includedTags:[],
        excludedTags:["b13b2a48-c720-44a9-9c77-39c9979373fb"],
        contentRating:[]
    };
    const [context, setContext] = React.useState(useLocation());
    const [searchObject, setSearchObject] = React.useState(initialSearchState);
    const [loadObject, setLoadObject] = React.useState(initialSearchState)
    const [responseData, setResponseData] = React.useState([]);
    const [offset, setOffset] = React.useState(api.limit);
    const [showButton, setShowButton] = React.useState(false);


    const [spinner, setSpinner] = React.useState(false); 

    const handleChange = e => {
        setSearchObject({...searchObject, title: e.target.value});
    }

    const handleRand = () => {
        setSpinner(true)
        setShowButton(false);
        api.getRandomManga()
        .then((response) => {
            console.log(response)
            response.data.data.relationships.forEach(relationship => {
                if (relationship.type === "cover_art") {
                    response.data.data["coverFile"] = `https://uploads.mangadex.org/covers/${response.data.data.id}/${relationship.attributes.fileName}`;
                }
            });
            setResponseData([response.data.data]);
            setSpinner(false)
        })
        .catch((error) => {
            console.log(error)
        });
    }

    const handleInput = () => {
        setSpinner(true)
        setOffset(api.limit)
        setShowButton(false)
        setLoadObject(context.state != null ? (context.state.searchObject != null ? context.state.searchObject : searchObject) : searchObject)
        api.queryManga(context.state != null ? (context.state.searchObject != null ? context.state.searchObject : searchObject) : searchObject)
        .then((response) => {
            setOffset(api.limit)
            console.log(response)

            if(response.data.data.length < api.limit || response.data.offset + api.limit === response.data.total) {
                console.log("shortened")
                setShowButton(false);
            }
            else {setShowButton(true)};
            response.data.data.forEach(result => {
                result.relationships.forEach(relationship => {
                    if (relationship.type === "cover_art") {
                        result["coverFile"] = `https://uploads.mangadex.org/covers/${result.id}/${relationship.attributes.fileName}`;
                    }
                });
            });
            setResponseData(response.data.data);
            setSpinner(false)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    React.useEffect(()=>{console.log(searchObject);}, [searchObject])

    const onEnter = e => {
        if (e.key === 'Enter') {
            handleInput();
        }
    }

    const loadMore = () => {
        setOffset(offset+api.limit)
        setShowButton(true)
        console.log('loading more...')
        api.queryManga({...loadObject, offset:offset})
        .then((response) => {
            if (response.data.data.length < api.limit || response.data.offset + api.limit === response.data.total) {
                setShowButton(false)
            }
            response.data.data.forEach(result => { // Preprocess cover art ids for api query
                result.relationships.forEach(relationship => {
                    if (relationship.type === "cover_art") {
                        result["coverFile"] = `https://uploads.mangadex.org/covers/${result.id}/${relationship.attributes.fileName}`;
                    }
                })
            })
            setResponseData(responseData.concat(response.data.data));
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const checkForExternalQueries = () => {
        if(context.state != null) {
            if(context.state.searchObject != null) {
                    if(context.state.searchObject.rand != null) {
                        handleRand();
                        delete context.state.searchObject.rand;
                    }else{
                        setSearchObject(searchObject => context.state.searchObject);
                        handleInput();
                        delete context.state.searchObject;
                        setSearchObject(initialSearchState)
                    }
                window.history.replaceState({}, document.title)
            }
        }
    }
    React.useEffect(() => {checkForExternalQueries();}, [context])

    return(
        <div>
            <components.SearchBar
            placeholder="Find a Manga!"
            onChange={handleChange}
            onKeyDown={onEnter}
            onClick={handleInput}
            onClickRand={handleRand}
            />
            {spinner?
                    <Container align={"center"}>
                        <Spinner animation={"border"} role={"status"} variant={"primary"}>
                            <span className={"visually-hidden"}>Loading...</span>
                        </Spinner>
                    </Container> : 
            <ul>
                <Grid container spacing={3}>
                    <Grid item md={12}>
                        <Grid container justifyContent="center" spacing={2}>
                            {responseData.map((item,index) =>(
                            <MangaCard
                                key={index}
                                name={item.attributes.title.en ? item.attributes.title.en : item.attributes.title.jp}
                                img={item.coverFile}
                                description={item.attributes.description.en? item.attributes.description.en.replace(/[^.]*\[.*/g, ''): ''}
                                id={item.id}
                                relationships={item.relationships}
                                status={item.attributes.status}
                                demographic={item.attributes.publicationDemographic? item.attributes.publicationDemographic :'N/A'}
                                tags={item.attributes.tags}
                            />
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </ul>
            }
            <Button variant="primary" onClick={loadMore} style={{visibility: showButton ? 'visible' : 'hidden' }}>
                Load More
            </Button>
        </div>
    );
}

function App() {
    return (
        <div className="search-manga">
            <components.TopBar/>
            <Container style={{marginTop:50}}>
                <SearchBar/>
            </Container>
        </div>
    );
};
 
export default App;
