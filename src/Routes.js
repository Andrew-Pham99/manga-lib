import React from 'react'
import {Route, Switch} from 'react-router-dom'
import App from "./App"
import Reader from "./Reader"

export default function Routes() {
    return (
      <Switch>
          <Route exact path={"/"}>
              <App/>
          </Route>
          <Route exact path={"/Reader"}>
              <Reader/>
          </Route>
      </Switch>
    );
}