import React from 'react'
import components from "./components/components";
import "./css/css_globals.css"

export default function NotFound() {
    return (
        <div align={"center"}>
            <components.TopNavBar/>
            <h3 style={{color:"var(--text-color)", marginTop:20}}>Sorry, this page could not be found!</h3>
        </div>
    )
}