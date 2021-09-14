import './App.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import api from './api';
import components from './components/components';
import {Container} from "react-bootstrap";
import Grid from '@material-ui/core/Grid';
import {Link, useLocation} from 'react-router-dom';

function MangaCard(props){
    return(
        <Card style={{width: '25rem', marginLeft:10, marginBottom:10}} key={props.key} id={props.id}>
            <Card.Img variant={"top"} src={props.img} alt={"No Image Found"} className={"thumbnail"} width={100} height={550}/>
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

function SearchBar(props){
    const [context, setContext] = React.useState(useLocation());
    const [searchQuery, setSearchQuery] = React.useState("");
    const [searchObject, setSearchObject] = React.useState({
        title:"",
        status:[],
        publicationDemographic:[],
        includedTags:[]
    });
    const [responseData, setResponseData] = React.useState([]);
    const [offset, setOffset] = React.useState(30);
    const [showButton, setShowButton] = React.useState(false);

    const handleChange = e => {
        setSearchQuery(e.target.value);
        setSearchObject({...searchObject, title: e.target.value});
    }

    const handleRand = () => {
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
        })
        .catch((error) => {
            console.log(error)
        });
    }

    const handleInput = () => {
        setOffset(30)
        setShowButton(false)
        api.queryManga(context.state != null ? (context.state.searchObject != null ? context.state.searchObject : searchObject) : searchObject)
        .then((response) => {
            setOffset(30)
            console.log(response)
            if(response.data.length < api.limit || response.data.offset + api.limit === response.data.total) {
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
        setOffset(offset+30)
        setShowButton(true)
        console.log('loading more...')
        api.queryManga({title:searchQuery, offset:offset})
        .then((response) => {
            if (response.data.results.length < api.limit || response.data.offset + api.limit === response.data.total) {
                setShowButton(false)
            }
            response.data.results.forEach(result => { // Preprocess cover art ids for api query
                result.relationships.forEach(relationship => {
                    if (relationship.type === "cover_art") {
                        result.data["coverFile"] = `https://uploads.mangadex.org/covers/${result.data.id}/${relationship.attributes.fileName}`;
                    }
                })
            })
            // Set the response data to the updated values after we append coverFile to the json objects
            setResponseData(responseData.concat(response.data.results));
        })
        .catch((error) => {
            console.log(error)
        })

    }

    const checkForExternalQueries = () => {
        if(context.state != null) {
            if(context.state.searchObject != null) {
                setSearchObject(searchObject => context.state.searchObject);
                handleInput();
                delete context.state.searchObject;
                setSearchObject({
                    title:"",
                    status:[],
                    publicationDemographic: [],
                    includedTags: []
                });
            }
        }
        // if(context.state != null){
        //     if(context.state.searchObject != null) {
        //         console.log("searchObject detected, executing search");
        //         if(context.state.searchObject.rand != null) {
        //             handleRand();
        //             delete context.state.searchObject.rand;
        //         }
        //         setSearchObject(context.state.searchObject);
        //         handleInput();
        //         delete context.state.searchObject;
        //     }
        // }
    }
    React.useEffect(() => {checkForExternalQueries();}, [context])

    //added a regex.

    return(
        <div>
            <components.SearchBar
            placeholder="Find a Manga!"
            onChange={handleChange}
            onKeyDown={onEnter}
            onClick={handleInput}
            onClickRand={handleRand}
            />
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
