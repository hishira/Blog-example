import React from "react";
import "./App.css";
import AppBar from "./components/shared/AppBar";
import Login from "./components/auth/login";
import SignUp from "./components/auth/signup";
import { Route } from "react-router-dom";
import { Provider } from "mobx-react";
import Cookies from "js-cookie";
import MainStore from "./store/main";
import PrivateRoute from "./components/shared/privateRoute";
import User from "./components/user/user";
import PostCreate from "./components/user/postcreate";
import EmailChange from "./components/user/emailchange";
import PasswordChange from './components/user/passwordchange'
function App() {
  let user = Cookies.getJSON("user");
  let stores = {
    mainStore: new MainStore(user ? user : null),
  };
  return (
    <Provider {...stores}>
      <div className="App">
        <AppBar />
        <Route component={Login} path="/login" />
        <Route component={SignUp} path="/signup" />
        <PrivateRoute component={User} path="/user" />
        <PrivateRoute component={PostCreate} path="/postcreate" />
        <PrivateRoute component={EmailChange} path="/emailchange" />
        <PrivateRoute component={PasswordChange} path="/passwordchange"/>
      </div>
    </Provider>
  );
}

export default App;
