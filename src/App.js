import './App.css';
import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card';
import api from './api'
import components from './components/components'
import {Container} from "react-bootstrap";
import Grid from '@material-ui/core/Grid'
import Routes from "./Routes"


function MangaCard(props){
    // For this to work you need to add 2 props: description and img from the api
    // I can add onClick functions to handle the view transformation with you want to keep everything
    //  on the same page, or we can have the button route to a new page.

    return(
        <Card style={{width: '25rem', marginLeft:10, marginBottom:10}}>
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
            </Card.Body>
            <Button variant={"primary"}>
                Read {props.name}
            </Button>
        </Card>
    );
}

function SearchBar(props){
    const[searchQuery, setSearchQuery] = React.useState();
    const[responseData, setResponseData] = React.useState([]);
    const[offset, setOffset] = React.useState(30);
    const[showButton, setShowButton] = React.useState(false);
    const[mangaIdList, setMangaIdList] = React.useState([]);

    //not used? idk
    const[coverFileList, setCoverFileList] = React.useState([])

    const handleChange = e => {
        setSearchQuery(e.target.value)
    }

    const handleRand = e => {
        setCoverFileList([])
        setMangaIdList([])
        setShowButton(false)
        
        api.getRandomManga()
        .then((response) => {

            
            response.data.relationships.forEach(relationship => {
                if (relationship.type === "cover_art") {
                    mangaIdList.push(relationship.id)
                    
                }
            })
            
            api.getCoverArt(mangaIdList[0])
            .then((coverResp) => {
                console.log(`https://uploads.mangadex.org/covers/${response.data.data.id}/${coverResp.data.data.attributes.fileName}`)
                response.data.data["coverFile"] = `https://uploads.mangadex.org/covers/${response.data.data.id}/${coverResp.data.data.attributes.fileName}`
                setResponseData([response.data])
            })
            .catch((error) => {
                console.log(error)
            })
       
           
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const handleInput = e => {
        setOffset(30)
        setShowButton(false)
        setCoverFileList([])
        setMangaIdList([])
        api.queryManga({title: searchQuery})
        .then((response) => {
            setOffset(30)
            setResponseData(response.data.results)
            console.log(response.data)
            if(response.data.results.length < api.limit || response.data.offset + api.limit === response.data.total) {
                setShowButton(false)
            }
            else {setShowButton(true)}
            // Code for grabbing many covers
            //
            response.data.results.forEach(result => { // Preprocess cover art ids for api query
                result.relationships.forEach(relationship => {
                    if (relationship.type === "cover_art") {
                        mangaIdList.push(relationship.id)
                    }
                })
            })
            //
            //     // Batch version of code == faster
            api.getCoverArtList(mangaIdList.slice(offset - 30, offset / 2)) // Change the subset grabbing once testing is done
                .then((CoverListResponse) => {
                    console.log(CoverListResponse)
                    CoverListResponse.data.results.forEach(coverFile => {
                        coverFile.relationships.forEach(relationship => {
                            if(relationship.type === "manga") {
                                setCoverFileList(coverFileList => [...coverFileList, `https://uploads.mangadex.org/covers/${relationship.id}/${coverFile.data.attributes.fileName}`])
                                response.data.results.forEach(result => {
                                    if(result.data.id === relationship.id){
                                        result.data["coverFile"] = `https://uploads.mangadex.org/covers/${relationship.id}/${coverFile.data.attributes.fileName}`
                                    }
                                })
                            }
                        })
                    })
                    return api.getCoverArtList(mangaIdList.slice(offset / 2, offset))
                }) // We can solve the batch loading character limit in the query by splitting it into two requests and chaining the promises
                .then((CoverListResponse2) => {
                    CoverListResponse2.data.results.forEach(coverFile2 => {
                        coverFile2.relationships.forEach(relationship2 => {
                            if(relationship2.type === "manga") {
                                setCoverFileList(coverFileList => [...coverFileList, `https://uploads.mangadex.org/covers/${relationship2.id}/${coverFile2.data.attributes.fileName}`])
                                response.data.results.forEach(result2 => {
                                    if(result2.data.id === relationship2.id) {
                                        result2.data["coverFile"] = `https://uploads.mangadex.org/covers/${relationship2.id}/${coverFile2.data.attributes.fileName}`
                                    }
                                })
                            }
                        })
                    })
                    // Set the response data to the updated values after we append coverFile to the json objects
                    setResponseData(response.data.results)
                    console.log(responseData)

                })
                .catch((CoverListError) => {
                    console.log(CoverListError)
                })
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const onEnter = e => {
        if (e.key === 'Enter') {
            setOffset(30)
            setShowButton(false)
            setCoverFileList([])
            setMangaIdList([])
            api.queryManga({title: searchQuery})
                .then((response) => {
                    setOffset(30)
                    setResponseData(response.data.results)
                    console.log(response.data)
                    if (response.data.results.length < api.limit || response.data.offset + api.limit === response.data.total) {
                        setShowButton(false)
                    } else {
                        setShowButton(true)
                    }
                    // Code for grabbing many covers
                    //
                    response.data.results.forEach(result => { // Preprocess cover art ids for api query
                        result.relationships.forEach(relationship => {
                            if (relationship.type === "cover_art") {
                                mangaIdList.push(relationship.id)
                            }
                        })
                    })
                    //
                    //     // Batch version of code == faster
                    api.getCoverArtList(mangaIdList.slice(offset - 30, offset / 2)) // Change the subset grabbing once testing is done
                        .then((CoverListResponse) => {
                            console.log(CoverListResponse)
                            CoverListResponse.data.results.forEach(coverFile => {
                                coverFile.relationships.forEach(relationship => {
                                    if (relationship.type === "manga") {
                                        setCoverFileList(coverFileList => [...coverFileList, `https://uploads.mangadex.org/covers/${relationship.id}/${coverFile.data.attributes.fileName}`])
                                        response.data.results.forEach(result => {
                                            if (result.data.id === relationship.id) {
                                                result.data["coverFile"] = `https://uploads.mangadex.org/covers/${relationship.id}/${coverFile.data.attributes.fileName}`
                                            }
                                        })
                                    }
                                })
                            })
                            return api.getCoverArtList(mangaIdList.slice(offset / 2, offset))
                        }) // We can solve the batch loading charater limit in the query by splitting it into two requests and chaining the promises
                        .then((CoverListResponse2) => {
                            CoverListResponse2.data.results.forEach(coverFile2 => {
                                coverFile2.relationships.forEach(relationship2 => {
                                    if (relationship2.type === "manga") {
                                        setCoverFileList(coverFileList => [...coverFileList, `https://uploads.mangadex.org/covers/${relationship2.id}/${coverFile2.data.attributes.fileName}`])
                                        response.data.results.forEach(result2 => {
                                            if (result2.data.id === relationship2.id) {
                                                result2.data["coverFile"] = `https://uploads.mangadex.org/covers/${relationship2.id}/${coverFile2.data.attributes.fileName}`
                                            }
                                        })
                                    }
                                })
                            })
                            // Set the response data to the updated values after we append coverFile to the json objects
                            setResponseData(response.data.results)
                            console.log(responseData)
                        })
                        .catch((CoverListError) => {
                            console.log(CoverListError)
                        })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    const loadMore = e => {
        setOffset(offset+30)

        setShowButton(true)

        setCoverFileList([])
        setMangaIdList([])
        console.log('loading more...')
        console.log(offset)
        api.queryManga({title: searchQuery, offset:offset})
        .then((response) => {
            setResponseData(responseData.concat(response.data.results))
            if(response.data.results.length < api.limit || response.data.offset + api.limit === response.data.total) {
                setShowButton(false)
            }
            console.log(responseData)
            response.data.results.forEach(result => { // Preprocess cover art ids for api query
                result.relationships.forEach(relationship => {
                    if (relationship.type === "cover_art") {
                        mangaIdList.push(relationship.id)
                    }
                })
            })
            api.getCoverArtList(mangaIdList.slice(api.limit - 30, api.limit / 2)) // Change the subset grabbing once testing is done
                .then((CoverListResponse) => {
                    console.log(CoverListResponse)
                    CoverListResponse.data.results.forEach(coverFile => {
                        coverFile.relationships.forEach(relationship => {
                            if(relationship.type === "manga") {
                                setCoverFileList(coverFileList => [...coverFileList, `https://uploads.mangadex.org/covers/${relationship.id}/${coverFile.data.attributes.fileName}`])
                                response.data.results.forEach(result => {
                                    if(result.data.id === relationship.id){
                                        result.data["coverFile"] = `https://uploads.mangadex.org/covers/${relationship.id}/${coverFile.data.attributes.fileName}`
                                    }
                                })
                            }
                        })
                    })
                    return api.getCoverArtList(mangaIdList.slice(api.limit / 2, api.limit))
                }) // We can solve the batch loading character limit in the query by splitting it into two requests and chaining the promises
                .then((CoverListResponse2) => {
                    CoverListResponse2.data.results.forEach(coverFile2 => {
                        coverFile2.relationships.forEach(relationship2 => {
                            if(relationship2.type === "manga") {
                                setCoverFileList(coverFileList => [...coverFileList, `https://uploads.mangadex.org/covers/${relationship2.id}/${coverFile2.data.attributes.fileName}`])
                                response.data.results.forEach(result2 => {
                                    if(result2.data.id === relationship2.id) {
                                        result2.data["coverFile"] = `https://uploads.mangadex.org/covers/${relationship2.id}/${coverFile2.data.attributes.fileName}`
                                    }
                                })
                            }
                        })
                    })
                    // Set the response data to the updated values after we append coverFile to the json objects
                    setResponseData(responseData.concat(response.data.results))
                    console.log(responseData)

                })
                .catch((CoverListError) => {
                    console.log(CoverListError)
                })
        })
        .catch((error) => {
            console.log(error)
        })

    }


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
                                console.log(responseData),
                            <MangaCard
                                key={index}
                                name={item.data.attributes.title.en}
                                img={item.data.coverFile}
                                description={item.data.attributes.description.en}
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
          <h1>Manga Lib</h1>
          <Container>
            <SearchBar/>
          </Container>
      </div>
    );
};
 
export default App;
