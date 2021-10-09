import './css/App.css';
import './css/standard_styles.css'
import React from 'react';
import api from './api';
import components from './components/components';
import {Container, Spinner, Button, Card} from "react-bootstrap";
import Grid from '@material-ui/core/Grid';
import {Link, useLocation, useHistory} from 'react-router-dom';
import { ownerDocument } from '@material-ui/core';

function MangaCard(props){
    const [vis, setVis] = React.useState(false)
    const [history, setHistory] = React.useState(useHistory());

    const onLoad = () => {
        setVis(true)
    };

    const handleMangaClick = () => {
        history.push({pathname:`/Info/manga=${props.id}`, state:props})
    };

    const handleMouseDown = (event) => {
        console.log(event)
        if(event.button == 1){
            localStorage.setItem("MANGAINFO_STATE", JSON.stringify(props));
            window.open(`/Info/manga=${props.id}`);
        }
    };

    return(
        <Card style={vis ? {} : {visibility:"visible"}} key={props.key} id={props.id} className={"manga-card"}>
            <Card.Img variant={"top"} src={props.img} alt={"No Image Found"} className={"thumbnail clickable"} width={100} height={550} onLoad={onLoad} onClick={handleMangaClick} onMouseDown={handleMouseDown}/>
            <Card.Body>
                <Card.Title onClick={handleMangaClick} onMouseDown={handleMouseDown} className={"clickable manga-card-text color"}>
                    {props.name}
                </Card.Title>
                <Card.Text className={"manga-card-text color"}>
                    <div className={"format"}>
                        <p>{props.description}</p>
                    </div>
                </Card.Text>
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
        let ord = ""
        setLoadObject(context.state != null ? (context.state.searchObject != null ? context.state.searchObject : searchObject) : searchObject)
        if(context.state!= null && context.state.order){
            ord = context.state.order
        }

        api.queryManga(context.state != null ? (context.state.searchObject != null ? context.state.searchObject : searchObject) : searchObject, ord)
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
            <Button onClick={loadMore} style={{visibility: showButton ? 'visible' : 'hidden', marginBottom:15}} className={"button-themed"}>
                Load More
            </Button>
        </div>
    );
}

function App() {
    const context = useLocation();
    if(context.state == undefined){
        context.state = JSON.parse(localStorage.getItem("SEARCH_STATE"));
        localStorage.removeItem("SEARCH_STATE");
    }
    return (
        <div className={"search-manga"}>
            <components.TopBar/>
            <Container style={{marginTop:50}}>
                <SearchBar/>
            </Container>
        </div>
    );
};
 
export default App;
