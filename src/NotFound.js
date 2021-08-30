import React from 'react'
import components from "./components/components";

export default function NotFound() {
    return (
        <div align={"center"}>
            <components.TopNavBar
                placeholder={"Find a Manga!"}
            />
            <h3>Sorry, this page could not be found!</h3>
        </div>
    )
}