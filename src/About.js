import React from "react";
import components from "./components/components";
import "./css/standard_styles.css"
import "./css/About.css"
import {Container, Card} from "react-bootstrap";


// TODO : Put about us information here and a way to route to this page
//      Probably want contact info, what this is, why we made it, etc...
function About() {
    return (
        <div className={"About"}>
            <Container className={"position-relative"}>
                <components.TopNavBar/>
                <h1 className={"text-center"} style={{marginTop: 10, color:"var(--text-color)"}}>About Us!</h1>
                {/*TODO : Put info for each dev in here, links to social profiles, etc...*/}
                {/*            Does Danathan want his name on this?*/}
                <Card className={"dev-card"}>
                    <Card.Title className={"text"}>Cole Nicholson-Rubidoux</Card.Title>
                    <Card.Body>
                        Hello World
                    </Card.Body>
                </Card>
                <div style={{margin: 10}}/>
                <Card className={"dev-card"}>
                    <Card.Title className={"text"}>Andrew Pham</Card.Title>
                    <Card.Body>

                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default About;