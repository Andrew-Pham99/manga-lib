import React from 'react'
import {Route, Switch, Link, Router} from 'react-router-dom'
import App from "./App"
import MangaInfo from "./MangaInfo"
import NotFound from "./NotFound"

export default function Routes() {
    return (
      <Switch>
          <Route exact path={"/"}>
              <App/>
          </Route>
          <Route path={"/Info/:manga"}>
              <MangaInfo/>
          </Route>
          <Route path={"/MangaInfo/:manga/:chapter"}>
              <MangaInfo/>
          </Route>
          <Route>
              <NotFound/>
          </Route>
      </Switch>
    );
}