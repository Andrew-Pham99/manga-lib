import React from "react";
import components from "./components/components";
import "./css/standard_styles.css"
import "./css/About.css"
import {Container, Card, ListGroup} from "react-bootstrap";


// TODO : Put about us information here and a way to route to this page
//      Probably want contact info, what this is, why we made it, etc...
function About() {
    return (
        <div className={"About"}>
            <components.TopNavBar/>
            <Container className={"position-relative"}>
                <h1 className={"text-center"} style={{marginTop: 10, color:"var(--text-color)"}}>About Us!</h1>
                {/*TODO : Put info for each dev in here, links to social profiles, etc...*/}
                {/*            Does Danathan want his name on this?*/}
                <Card className={"dev-card"}>
                    <Card.Title className={""}>Cole Nicholson-Rubidoux</Card.Title>
                    <Card.Body>
                        <Card.Text>
                            Hello, I am a recent graduate from Sonoma State University with a Bachelor's Degree in
                            Computer Science. I have been programming for about 5 years as of October 2021 and have
                            gained familiarity in most of the common programming languages as well as some more esoteric
                            ones. We decided to make this app when the MangaDex site went down and there was no decent
                            place to read manga. So we took this opportunity to learn a web design framework (React
                            in this case) and build something which would be both fun and bolster our resumes. If you
                            want to report a bug, request a feature, or contact me for other reasons, feel free to
                            send me an email at the link below. I have also included links to my LinkedIn and Github
                            accounts for those that might want to check out my other work. Thank you for using our site!
                        </Card.Text>
                        <ListGroup>
                            <ListGroup.Item>
                                <Card.Link onClick={(event) => {window.open(`mailto:cnicholsonrubidoux@gmail.com`, `mail`); event.preventDefault()}} href={`mailto:cnicholsonrubidoux@gmail.com`}>
                                    CNicholsonRubidoux@Gmail.com
                                </Card.Link>
                                <Card.Link href={`https://www.linkedin.com/in/cole-nicholson-rubidoux-761922160/`} target={"_blank"}>
                                    LinkedIn
                                </Card.Link>
                                <Card.Link href={`https://github.com/ColeNicholson`} target={"_blank"}>
                                    Github
                                </Card.Link>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
                <div style={{margin: 10}}/>
                <Card className={"dev-card"}>
                    <Card.Title className={""}>Andrew Pham</Card.Title>
                    <Card.Body>

                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default About;