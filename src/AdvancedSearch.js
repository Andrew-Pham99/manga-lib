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
    const [formData, setFormData] = React.useState({
        title:"",
        rand:false,
        status:[],
        publicationDemographic:[],
        includedTags:[]
    });
    const [showTags, setShowTags] = React.useState(false);
    const getAllTags = () => {
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
                })
            })
            .catch((error) => {
                console.log(error);
            })
    };
    React.useEffect(() => {getAllTags();}, []);
    const handleTextChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    };
    const handleStatusChange = (event) => {
        if(event.target.checked) {
            setFormData({...formData, status: [...formData.status, event.target.name ]});
        }
        else {
            setFormData({...formData, status: formData.status.filter((item) => item != event.target.name)});
        }

    };
    const handleDemoChange = (event) => {
        if(event.target.checked) {
            setFormData({...formData, publicationDemographic: [...formData.publicationDemographic, event.target.name ]});
        }
        else {
            setFormData({...formData, publicationDemographic: formData.publicationDemographic.filter((item) => item != event.target.name)});
        }
    };
    const handleTagChange = (event) => {
        if(event.target.checked) {
            setFormData({...formData, includedTags: [...formData.includedTags, event.target.getAttribute("tagid")]})
        }
        else {
            setFormData({...formData, includedTags: formData.includedTags.filter((item) => item != event.target.getAttribute("tagid"))});
        }
    };
    const handleSubmit = () => {
        history.push({pathname:`/`, state:{searchObject: {title: formData.title, status: formData.status, publicationDemographic: formData.publicationDemographic, includedTags: formData.includedTags}}});
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group  controlId={"title"}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type={"text"} name={"title"} placeholder={"Title"} onChange={handleTextChange}/>
                </Form.Group>
                {/*<Form.Group controlId={"artist"}>*/}
                {/*    <Form.Label>Artist</Form.Label>*/}
                {/*    <Form.Control type={"text"} name={"artist"} placeholder={"Artist"} onChange={handleTextChange}/>*/}
                {/*</Form.Group>*/}
                <Row>
                    <Form.Group controlId={"status"} as={Col}>
                        <Form.Label>Status</Form.Label>
                        <Form.Group>
                            <Form.Check type={"checkbox"} label={"Ongoing"} name={"ongoing"} id={"ongoing"} onChange={handleStatusChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check type={"checkbox"} label={"Hiatus"} name={"hiatus"} id={"hiatus"} onChange={handleStatusChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check type={"checkbox"} label={"Completed"} name={"completed"} id={"completed"} onChange={handleStatusChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check type={"checkbox"} label={"Cancelled"} name={"cancelled"} id={"cancelled"} onChange={handleStatusChange}/>
                        </Form.Group>
                    </Form.Group>
                    <Form.Group controlId={"demo"} as={Col}>
                        <Form.Label>Demographics</Form.Label>
                        <Form.Check type={"checkbox"} label={"Shounen"} name={"shounen"} id={"shounen"} onChange={handleDemoChange}/>
                        <Form.Check type={"checkbox"} label={"Shoujo"} name={"shoujo"} id={"shoujo"} onChange={handleDemoChange}/>
                        <Form.Check type={"checkbox"} label={"Seinen"} name={"seinen"} id={"seinen"} onChange={handleDemoChange}/>
                        <Form.Check type={"checkbox"} label={"Josei"} name={"josei"} id={"josei"} onChange={handleDemoChange}/>
                        <Form.Check type={"checkbox"} label={"None"} name={"none"} id={"none"} onChange={handleDemoChange}/>
                    </Form.Group>
                </Row>
                <Form.Group controlId={"tag"}>
                    <Button variant={"primary"} onClick={() => {setShowTags(!showTags);}}>Show Tags</Button>
                    <Form.Group controlId={"groupedTags"} style={{visibility: showTags ? 'visible' : 'hidden'}}>
                        <Form.Group controlId={"genreTags"}>
                            <Form.Label>Genres</Form.Label><br/>
                            {genreTags.map((tag, index) => {
                                return (
                                    <Form.Check inline key={index} type={"checkbox"} onChange={handleTagChange} label={tag.name} name={tag.name} id={tag.name} tagid={tag.id}/>
                                );
                            })}
                        </Form.Group>
                        <Form.Group controlId={"themeTags"}>
                            <Form.Label>Themes</Form.Label><br/>
                            {themeTags.map((tag, index) => {
                                return (
                                    <Form.Check inline key={index} type={"checkbox"} onChange={handleTagChange} label={tag.name} name={tag.name} id={tag.name} tagid={tag.id}/>
                                );
                            })}
                        </Form.Group>
                        <Form.Group controlId={"formatTags"}>
                            <Form.Label>Formats</Form.Label><br/>
                            {formatTags.map((tag, index) => {
                                return (
                                    <Form.Check inline key={index} type={"checkbox"} onChange={handleTagChange} label={tag.name} name={tag.name} id={tag.name} tagid={tag.id}/>
                                );
                            })}
                        </Form.Group>
                        <Form.Group controlId={"contentTags"}>
                            <Form.Label>Content</Form.Label><br/>
                            {contentTags.map((tag, index) => {
                                return (
                                    <Form.Check inline key={index} type={"checkbox"} onChange={handleTagChange} label={tag.name} name={tag.name} id={tag.name} tagid={tag.id}/>
                                );
                            })}
                        </Form.Group>
                    </Form.Group>
                </Form.Group>
                <Button variant={"primary"} type={"submit"} >Search</Button>
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