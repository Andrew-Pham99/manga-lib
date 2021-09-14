import React from 'react'
import {Route, Switch, Link, Router} from 'react-router-dom'
import App from "./App"
import MangaInfo from "./MangaInfo"
import Reader from "./Reader"
import NotFound from "./NotFound"
import AdvancedSearch from "./AdvancedSearch";

export default function Routes() {
    return (
      <Switch>
          <Route exact path={"/"}>
              <App/>
          </Route>
          <Route exact path={"/AdvancedSearch"}>
              <AdvancedSearch/>
          </Route>
          <Route path={"/Info/:manga"}>
              <MangaInfo/>
          </Route>
          <Route path={"/Reader/:manga/:chapter"}>
              <Reader/>
          </Route>
          <Route>
              <NotFound/>
          </Route>
      </Switch>
    );
}