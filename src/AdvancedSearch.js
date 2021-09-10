import React from "react";
import api from "./api";
import components from "./components/components";
import {useLocation, useHistory, Link} from "react-router-dom";
import "./AdvancedSearch.css"
import {Container, Button, Form, Row, Col} from "react-bootstrap";

function AdvancedSearchFields() {
    const [history, setHistory] = React.useState(useHistory());
    const [genreTags, setGenreTags] = React.useState([]);
    const [themeTags, setThemeTags] = React.useState([]);
    const [formatTags, setFormatTags] = React.useState([]);
    const [contentTags, setContentTags] = React.useState([]);
    const [showTags, setShowTags] = React.useState(false);
    const getAllTags = () => {
        setGenreTags([]);
        setThemeTags([]);
        setFormatTags([]);
        setContentTags([]);
        api.getTags()
            .then((response) => {
                response.data.forEach((tag) => {
                    switch (tag.data.attributes.group) {
                        case "genre":
                            setGenreTags(genreTags => [...genreTags, {
                                group:tag.data.attributes.group,
                                name:tag.data.attributes.name.en,
                                id:tag.data.id,
                                type:tag.data.type}]);
                            break;
                        case "theme":
                            setThemeTags(themeTags => [...themeTags, {
                                group:tag.data.attributes.group,
                                name:tag.data.attributes.name.en,
                                id:tag.data.id,
                                type:tag.data.type}]);
                            break;
                        case "format":
                            setFormatTags(formatTags => [...formatTags, {
                                group:tag.data.attributes.group,
                                name:tag.data.attributes.name.en,
                                id:tag.data.id,
                                type:tag.data.type}]);
                            break;
                        case "content":
                            setContentTags(contentTags => [...contentTags, {
                                group:tag.data.attributes.group,
                                name:tag.data.attributes.name.en,
                                id:tag.data.id,
                                type:tag.data.type}]);
                            break;
                        default:
                            break;
                    }
                })
            })
            .catch((error) => {
                console.log(error);
            })
    };
    React.useEffect(() => {getAllTags();}, []);
    const handleEnter = (event) => {
        if(event.key == "Enter"){
            handleSubmit(event);
        }
    };
    const handleSubmit = (event) => {
        console.log(event);
        // Assemble search object from event data
        let searchObject = {
            title:event.target.title.value,
            artist:event.target.artist.value,
            status:[

            ],
            demographics:[

            ],
            tags:[

            ]
        };
        console.log(searchObject);
        // history.push({pathname:`/`, state:{searchObject:{title:}}})
    };

    return (
        <div>
            <Form onSubmit={handleSubmit} onKeyDown={handleEnter}>
                <Form.Group  controlId={"title"}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type={"text"} placeholder={"Title"}/>
                </Form.Group>
                <Form.Group controlId={"artist"}>
                    <Form.Label>Artist</Form.Label>
                    <Form.Control type={"text"} placeholder={"Artist"}/>
                </Form.Group>
                <Row>
                    <Form.Group controlId={"status"} as={Col}>
                        <Form.Label>Status</Form.Label>
                        <Form.Group>
                            <Form.Check type={"checkbox"} label={"Ongoing"} name={"ongoing"} id={"ongoing"}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check type={"checkbox"} label={"Hiatus"} name={"hiatus"} id={"hiatus"}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check type={"checkbox"} label={"Completed"} name={"completed"} id={"completed"}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check type={"checkbox"} label={"Canceled"} name={"canceled"} id={"canceled"}/>
                        </Form.Group>
                    </Form.Group>
                    <Form.Group controlId={"demo"} as={Col}>
                        <Form.Label>Demographics</Form.Label>
                        <Form.Check type={"checkbox"} label={"Shounen"} name={"shounen"} id={"shounen"}/>
                        <Form.Check type={"checkbox"} label={"Shoujo"} name={"shoujo"} id={"shoujo"}/>
                        <Form.Check type={"checkbox"} label={"Seinen"} name={"seinen"} id={"seinen"}/>
                        <Form.Check type={"checkbox"} label={"Josei"} name={"josei"} id={"josei"}/>
                    </Form.Group>
                </Row>
                <Form.Group controlId={"tag"}>
                    <Button variant={"primary"} onClick={() => {setShowTags(!showTags);}}>Show Tags</Button>
                    <Form.Group controlId={"groupedTags"} style={{visibility: showTags ? 'visible' : 'hidden'}}>
                        <Form.Group controlId={"genreTags"}>
                            <Form.Label>Genres</Form.Label><br/>
                            {genreTags.map((tag, index) => {
                                return (
                                    <Form.Check inline key={index} type={"checkbox"} label={tag.name} name={tag.name} id={tag.name} hash={tag.id}/>
                                );
                            })}
                        </Form.Group>
                        <Form.Group controlId={"themeTags"}>
                            <Form.Label>Themes</Form.Label><br/>
                            {themeTags.map((tag, index) => {
                                return (
                                    <Form.Check inline key={index} type={"checkbox"} label={tag.name} name={tag.name} id={tag.name} hash={tag.id}/>
                                );
                            })}
                        </Form.Group>
                        <Form.Group controlId={"formatTags"}>
                            <Form.Label>Formats</Form.Label><br/>
                            {formatTags.map((tag, index) => {
                                return (
                                    <Form.Check inline key={index} type={"checkbox"} label={tag.name} name={tag.name} id={tag.name} hash={tag.id}/>
                                );
                            })}
                        </Form.Group>
                        <Form.Group controlId={"contentTags"}>
                            <Form.Label>Content</Form.Label><br/>
                            {contentTags.map((tag, index) => {
                                return (
                                    <Form.Check inline key={index} type={"checkbox"} label={tag.name} name={tag.name} id={tag.name} hash={tag.id}/>
                                );
                            })}
                        </Form.Group>
                    </Form.Group>
                </Form.Group>
                <Button variant={"primary"} type={"submit"} onClick={handleSubmit}>Search</Button>
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