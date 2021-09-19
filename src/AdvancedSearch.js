import React from "react";
import api from "./api";
import components from "./components/components";
import {useHistory} from "react-router-dom";
import "./AdvancedSearch.css"
import {Container, Button, Form, Row, Col, Spinner} from "react-bootstrap";

function AdvancedSearchFields() {
    const initialSearchState = {
        title:"",
        status:[],
        publicationDemographic:[],
        includedTags:[],
        excludedTags:[],
        contentRating:[]
    };
    const [history, setHistory] = React.useState(useHistory()); // Do not remove setHistory hook even if it is flagged as unused. Doing so will break the functions that call history.push()
    const [genreTags, setGenreTags] = React.useState([]);
    const [themeTags, setThemeTags] = React.useState([]);
    const [formatTags, setFormatTags] = React.useState([]);
    const [contentTags, setContentTags] = React.useState([]);
    const [tagsFetched, setTagsFetched] = React.useState(false);
    const [searchObject, setSearchObject] = React.useState(initialSearchState);
    React.useEffect(()=>{console.log(searchObject)},[searchObject]);

    const getAllTags = () => {
        // This function grabs all the tags from the api then sorts each tag into its own hook depending on the type
        setGenreTags([]);
        setThemeTags([]);
        setFormatTags([]);
        setContentTags([]);
        api.getTags()
            .then((response) => {
                console.log(response);
                response.data.data.forEach((tag) => {
                    switch (tag.attributes.group) {
                        case "genre":
                            setGenreTags(genreTags => [...genreTags, {
                                group:tag.attributes.group,
                                name:tag.attributes.name.en,
                                id:tag.id,
                                type:tag.type}]);
                            break;
                        case "theme":
                            setThemeTags(themeTags => [...themeTags, {
                                group:tag.attributes.group,
                                name:tag.attributes.name.en,
                                id:tag.id,
                                type:tag.type}]);
                            break;
                        case "format":
                            setFormatTags(formatTags => [...formatTags, {
                                group:tag.attributes.group,
                                name:tag.attributes.name.en,
                                id:tag.id,
                                type:tag.type}]);
                            break;
                        case "content":
                            setContentTags(contentTags => [...contentTags, {
                                group:tag.attributes.group,
                                name:tag.attributes.name.en,
                                id:tag.id,
                                type:tag.type}]);
                            break;
                        default:
                            break;
                    }
                    setTagsFetched(true);
                })
            })
            .catch((error) => {
                console.log(error);
            })
    };
    React.useLayoutEffect(() => {getAllTags();}, []);
    const handleTitleChange = (event) => {
        // Sets the title field of the searchObject
        setSearchObject({...searchObject, [event.target.name]: event.target.value});
    };
    const handleStatusChange = (event) => {
        // Functions with this signature append and remove checkbox ticks from their respective searchObject arrays
        if(event.target.checked) {
            setSearchObject({...searchObject, status: [...searchObject.status, event.target.name ]});
        }
        else {
            setSearchObject({...searchObject, status: searchObject.status.filter((item) => item !== event.target.name)});
        }

    };
    const handleDemoChange = (event) => {
        if(event.target.checked) {
            setSearchObject({...searchObject, publicationDemographic: [...searchObject.publicationDemographic, event.target.name ]});
        }
        else {
            setSearchObject({...searchObject, publicationDemographic: searchObject.publicationDemographic.filter((item) => item !== event.target.name)});
        }
    };
    const handleContentChange = (event) => {
        if(event.target.checked) {
            setSearchObject({...searchObject, contentRating: [...searchObject.contentRating, event.target.name ]});
        }
        else {
            setSearchObject({...searchObject, contentRating: searchObject.contentRating.filter((item) => item !== event.target.name)});
        }
    };
    const handleIncludedTagChange = (event) => {
        if(event.target.checked) {
            setSearchObject({...searchObject, includedTags: [...searchObject.includedTags, event.target.getAttribute("tagid")]})
        }
        else {
            setSearchObject({...searchObject, includedTags: searchObject.includedTags.filter((item) => item !== event.target.getAttribute("tagid"))});
        }
    };
    const handleExcludedTagChange = (event) => {
        if(event.target.checked) {
            setSearchObject({...searchObject, excludedTags: [...searchObject.excludedTags, event.target.getAttribute("tagid")]})
        }
        else {
            setSearchObject({...searchObject, excludedTags: searchObject.excludedTags.filter((item) => item !== event.target.getAttribute("tagid"))});
        }
    };
    const handleSubmit = () => {
        // This function sends us to the search results page with the newly assembled searchObject
        history.push({pathname:`/`, state:{searchObject: {...searchObject}}});
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group  controlId={"title"}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type={"text"} name={"title"} placeholder={"Title"} onChange={handleTitleChange}/>
                </Form.Group>
                <Row>
                    <Form.Group controlId={"status"} as={Col}>
                        <Form.Label>Status</Form.Label>
                        <Form.Check type={"checkbox"} label={"Ongoing"} name={"ongoing"} id={"ongoing"} onChange={handleStatusChange}/>
                        <Form.Check type={"checkbox"} label={"Hiatus"} name={"hiatus"} id={"hiatus"} onChange={handleStatusChange}/>
                        <Form.Check type={"checkbox"} label={"Completed"} name={"completed"} id={"completed"} onChange={handleStatusChange}/>
                        <Form.Check type={"checkbox"} label={"Cancelled"} name={"cancelled"} id={"cancelled"} onChange={handleStatusChange}/>
                    </Form.Group>
                    <Form.Group controlId={"demo"} as={Col}>
                        <Form.Label>Demographics</Form.Label>
                        <Form.Check type={"checkbox"} label={"Shounen"} name={"shounen"} id={"shounen"} onChange={handleDemoChange}/>
                        <Form.Check type={"checkbox"} label={"Shoujo"} name={"shoujo"} id={"shoujo"} onChange={handleDemoChange}/>
                        <Form.Check type={"checkbox"} label={"Seinen"} name={"seinen"} id={"seinen"} onChange={handleDemoChange}/>
                        <Form.Check type={"checkbox"} label={"Josei"} name={"josei"} id={"josei"} onChange={handleDemoChange}/>
                    </Form.Group>
                    <Form.Group controlId={"content"} as={Col}>
                        <Form.Label>Content</Form.Label>
                        <Form.Check type={"checkbox"} label={"Safe"} name={"safe"} id={"safe"} onChange={handleContentChange}/>
                        <Form.Check type={"checkbox"} label={"Suggestive"} name={"suggestive"} id={"suggestive"} onChange={handleContentChange}/>
                        <Form.Check type={"checkbox"} label={"Erotica"} name={"erotica"} id={"erotica"} onChange={handleContentChange}/>
                        <Form.Check type={"checkbox"} label={"Pornographic"} name={"pornographic"} id={"pornographic"} onChange={handleContentChange}/>
                    </Form.Group>
                </Row>
                <br/>
                {/*This block is used to conditionally render a spinner before all of the tag data is loaded from the api*/}
                {tagsFetched ?
                    <Form.Group controlId={"tags"}>
                        <Form.Group controlId={"includedTags"}>
                            <p>Include these tags:</p>
                            <Form.Group controlId={"includedGenreTags"}>
                                <Form.Label>Genres</Form.Label><br/>
                                <Row lg={"10"}>
                                    {genreTags.map((tag, index) => {
                                        return (
                                            <Col lg={"2"} key={index}>
                                                <Form.Check inline key={index} type={"checkbox"} onChange={handleIncludedTagChange} label={tag.name} name={tag.name} id={"included" + tag.name} tagid={tag.id}/>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Form.Group><br/>
                            <Form.Group controlId={"includedThemeTags"}>
                                <Form.Label>Themes</Form.Label><br/>
                                <Row lg={"10"}>
                                    {themeTags.map((tag, index) => {
                                        return (
                                            <Col lg={"2"} key={index}>
                                                <Form.Check inline key={index} type={"checkbox"} onChange={handleIncludedTagChange} label={tag.name} name={tag.name} id={"included" + tag.name} tagid={tag.id}/>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Form.Group><br/>
                            <Form.Group controlId={"includedFormatTags"}>
                                <Form.Label>Formats</Form.Label><br/>
                                <Row lg={"10"}>
                                    {formatTags.map((tag, index) => {
                                        return (
                                            <Col lg={"2"} key={index}>
                                                <Form.Check inline key={index} type={"checkbox"} onChange={handleIncludedTagChange} label={tag.name} name={tag.name} id={"included" + tag.name} tagid={tag.id}/>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Form.Group><br/>
                            <Form.Group controlId={"includedContentTags"}>
                                <Form.Label>Content</Form.Label><br/>
                                <Row lg={"10"}>
                                    {contentTags.map((tag, index) => {
                                        return (
                                            <Col lg={"2"} key={index}>
                                                <Form.Check inline key={index} type={"checkbox"} onChange={handleIncludedTagChange} label={tag.name} name={tag.name} id={"included" + tag.name} tagid={tag.id}/>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Form.Group>
                        </Form.Group>
                        <br/><br/>
                        <Form.Group controlId={"excludedTags"}>
                            <p>Exclude these tags:</p>
                            <Form.Group controlId={"excludedGenreTags"}>
                                <Form.Label>Genres</Form.Label><br/>
                                    <Row lg={"10"}>
                                        {genreTags.map((tag, index) => {
                                            return (
                                                <Col lg={"2"} key={index}>
                                                    <Form.Check inline key={index} type={"checkbox"} onChange={handleExcludedTagChange} label={tag.name} name={tag.name} id={"excluded" + tag.name} tagid={tag.id}/>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                            </Form.Group><br/>
                            <Form.Group controlId={"excludedThemeTags"}>
                                <Form.Label>Themes</Form.Label><br/>
                                <Row lg={"10"}>
                                    {themeTags.map((tag, index) => {
                                        return (
                                            <Col lg={"2"} key={index}>
                                                <Form.Check inline key={index} type={"checkbox"} onChange={handleExcludedTagChange} label={tag.name} name={tag.name} id={"excluded" + tag.name} tagid={tag.id}/>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Form.Group><br/>
                            <Form.Group controlId={"excludedFormatTags"}>
                                <Form.Label>Formats</Form.Label><br/>
                                <Row lg={"10"}>
                                    {formatTags.map((tag, index) => {
                                        return (
                                            <Col lg={"2"} key={index}>
                                                <Form.Check inline key={index} type={"checkbox"} onChange={handleExcludedTagChange} label={tag.name} name={tag.name} id={"excluded" + tag.name} tagid={tag.id}/>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Form.Group><br/>
                            <Form.Group controlId={"excludedContentTags"}>
                                <Form.Label>Content</Form.Label><br/>
                                <Row lg={"10"}>
                                    {contentTags.map((tag, index) => {
                                        return (
                                            <Col lg={"2"} key={index}>
                                                <Form.Check inline key={index} type={"checkbox"} onChange={handleExcludedTagChange} label={tag.name} name={tag.name} id={"excluded" + tag.name} tagid={tag.id}/>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Form.Group>
                        </Form.Group>
                    </Form.Group>
                    :
                    <Container align={"center"}>
                        <Spinner animation={"border"} role={"status"} variant={"primary"}>
                            <span className={"visually-hidden"}>Loading...</span>
                        </Spinner>
                    </Container>
                }
                <br/>
                <div className={"d-grid"}>
                    <Button variant={"primary"} type={"submit"} size={"lg"}>Search</Button>
                </div>
                <br/>
                <br/>
            </Form>
        </div>
    );
}

function AdvancedSearch() {
    return (
        <div>
            <Container>
                <components.TopBar/>
                <AdvancedSearchFields/>
            </Container>
        </div>
    );
}

export default AdvancedSearch;