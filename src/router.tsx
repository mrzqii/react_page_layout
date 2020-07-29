import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Login from './page/login'
import Editor from './page/rgl'
import Regist from './page/regist'
export default function App() {
    return (
      <Router>
          <Switch>
            <Route path="/" exact  component={Login}/>
            <Route path="/login" component={Login}/>
            <Route path="/editor" component = {Editor}/>
            <Route path="/regist" component={Regist}/>
          </Switch>
      </Router>
    );
  }

  

  // function Permission(props:any) {
  //     return <Route {...props}/>
  // }
  