import React from "react";
import "./App.css";
import AppBar from "./components/shared/AppBar";
import Login from "./components/auth/login";
import SignUp from "./components/auth/signup";
import { Route } from "react-router-dom";
import { Provider } from "mobx-react";
import Cookies from "js-cookie";
import MainStore from "./store/main";
import UserStore from './store/user'
import PrivateRoute from "./components/shared/privateRoute";
import User from "./components/user/user";
import PostCreate from "./components/post/postcreate";
import EmailChange from "./components/user/emailchange";
import PasswordChange from './components/user/passwordchange'
import UserFind from './components/user/userFind'
import PublicUserProfile from './components/user/userPublicProfile'
import DescriptionChange from './components/user/descriptionChange'
import UserEditPanel from './components/user/admin/userEditPanel'
import UserInfoEdit from './components/user/admin/userInfoEdit'
import UserPosts from './components/user/admin/usersPosts'

function App() {
  let user = Cookies.getJSON("user");
  console.log(user)
  let stores = {
    mainStore: new MainStore(user ? user : null),
    userStore: new UserStore(user?user:null)
  };
  return (
    <Provider {...stores}>
      <div className="App">
        <AppBar />
        <Route component={Login} path="/login" />
        <Route component={SignUp} path="/signup" />
        <Route component={UserFind} path="/userfind/:user"/>
        <PrivateRoute component={User} path="/user" />
        <PrivateRoute component={PostCreate} path="/postcreate" />
        <PrivateRoute component={EmailChange} path="/emailchange" />
        <PrivateRoute component={PasswordChange} path="/passwordchange"/>
        <Route component={PublicUserProfile} path="/userprofile/:id"/>
        <PrivateRoute component={DescriptionChange} path="/descriptionchange"/>
        <PrivateRoute component={UserEditPanel} path="/useredits"/>
        <PrivateRoute component={UserInfoEdit} path="/edit/:id"/>
        <PrivateRoute component={UserPosts} path="/userposts/:id"/>
      </div>
    </Provider>
  );
}

export default App;
