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
    const[context, setContext] = React.useState(useLocation());
    const[searchQuery, setSearchQuery] = React.useState();
    const[responseData, setResponseData] = React.useState([]);
    const[offset, setOffset] = React.useState(30);
    const[showButton, setShowButton] = React.useState(false);

    const handleChange = e => {
        setSearchQuery(e.target.value)
    }

    const handleRand = e => {
        setShowButton(false);

        api.getRandomManga()
        .then((response) => {
            console.log(response)
            response.data.relationships.forEach(relationship => {
                if (relationship.type === "cover_art") {
                    response.data.data["coverFile"] = `https://uploads.mangadex.org/covers/${response.data.data.id}/${relationship.attributes.fileName}`;
                    setResponseData([response.data]);
                }
            });
        })
        .catch((error) => {
            console.log(error)
        });
    }

    const handleInput = e => {
        setOffset(30)
        setShowButton(false)
        api.queryManga(context.state != null ? (context.state.searchQuery != null ? {title:context.state.searchQuery} : {title:searchQuery}) : {title:searchQuery})
        .then((response) => {
            setOffset(30)
            console.log(response.data)
            if(response.data.results.length < api.limit || response.data.offset + api.limit === response.data.total) {
                setShowButton(false);
            }
            else {setShowButton(true)};
            response.data.results.forEach(result => {
                result.relationships.forEach(relationship => {
                    if (relationship.type === "cover_art") {
                        result.data["coverFile"] = `https://uploads.mangadex.org/covers/${result.data.id}/${relationship.attributes.fileName}`;
                    }
                })
            })
            setResponseData(response.data.results)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const onEnter = e => {
        if (e.key === 'Enter') {
            setOffset(30)
            setShowButton(false)
            api.queryManga(context.state != null ? (context.state.searchQuery != null ? {title:context.state.searchQuery} : {title:searchQuery}) : {title:searchQuery})
                .then((response) => {
                    setOffset(30)
                    console.log(response.data)
                    if(response.data.results.length < api.limit || response.data.offset + api.limit === response.data.total) {
                        setShowButton(false);
                    }
                    else {
                        setShowButton(true);
                    };
                    response.data.results.forEach(result => {
                        result.relationships.forEach(relationship => {
                            if (relationship.type === "cover_art") {
                                result.data["coverFile"] = `https://uploads.mangadex.org/covers/${result.data.id}/${relationship.attributes.fileName}`;
                            }
                        })
                    })
                    setResponseData(response.data.results)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    const loadMore = e => {
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
        if(context.state != null){
            if(context.state.randSearch != null){
                console.log("Rand search request received from another page.")
                handleRand();
                context.state.randSearch = null;
            }
            else if(context.state.searchQuery != null) {
                console.log("Search request received from another page. Search query is: " + context.state.searchQuery)
                setSearchQuery(context.state.searchQuery);
                handleInput();
                context.state.searchQuery = null;
            }
            else if(context.state.searchEmptyString != null) {
                console.log("Empty string search request received from another page.")
                handleInput();
                context.state.searchEmptyString = null;
            }
            console.log(context.state);
            context.state = null;
        }
    }
    React.useEffect(() => {checkForExternalQueries();}, [context])

    //added a regex.

    return(
        <div>
            <components.SearchBar
            placeholder="Find a Manga!"
            onChange={handleChange}
            onClick={handleInput}
            onKeyDown={onEnter}
            onClickRand={handleRand}
            />
            <ul>
                <Grid container spacing={3}>
                    <Grid item md={12}>
                        <Grid container justifyContent="center" spacing={2}>
                            {responseData.map((item,index) =>(
                            <MangaCard
                                key={index}
                                name={item.data.attributes.title.en ? item.data.attributes.title.en : item.data.attributes.title.jp}
                                img={item.data.coverFile}
                                description={item.data.attributes.description.en? item.data.attributes.description.en.replace(/[^.]*\[.*/g, ''): ''}
                                id={item.data.id}
                                relationships={item.relationships}
                                status={item.data.attributes.status}
                                demographic={item.data.attributes.publicationDemographic? item.data.attributes.publicationDemographic :'N/A'}
                                tags={item.data.attributes.tags}
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
            <Container>
                <SearchBar/>
            </Container>
        </div>
    );
};
 
export default App;
