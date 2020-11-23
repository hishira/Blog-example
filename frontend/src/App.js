import React from "react";
import "./App.css";
import AppBar from "./components/shared/AppBar";
import Login from "./components/auth/login";
import SignUp from "./components/auth/signup";
import { Route } from "react-router-dom";
import { Provider } from "mobx-react";
import Cookies from "js-cookie";
import MainStore from "./store/main";
import UserStore from "./store/user";
import PrivateRoute from "./components/shared/privateRoute";
import User from "./components/user/normaluser/user";
import PostCreate from "./components/post/postcreate";
import EmailChange from "./components/user/normaluser/emailchange";
import PasswordChange from "./components/user/normaluser/passwordchange";
import UserFind from "./components/user/normaluser/userFind";
import PublicUserProfile from "./components/user/normaluser/userPublicProfile";
import DescriptionChange from "./components/user/normaluser/descriptionChange";
import UserEditPanel from "./components/user/admin/userEditPanel";
import UserInfoEdit from "./components/user/admin/userInfoEdit";
import UserPosts from "./components/user/admin/usersPosts";
import UserComments from "./components/user/admin/userComments";
import Posts from "./components/user/admin/posts";
import Comments from "./components/user/admin/comments";
import UserSettings from "./components/user/normaluser/userSettings";
import AdminPanel from "./components/user/admin/adminPanel";
import WatchedUserPosts from "./components/user/normaluser/watcheduserposts";
function App() {
  let user = Cookies.getJSON("user");
  console.log(user);
  let stores = {
    mainStore: new MainStore(user ? user : null),
    userStore: new UserStore(user ? user : null),
  };
  return (
    <Provider {...stores}>
      <div className="App">
        <AppBar />
        <Route component={Login} path="/login" />
        <Route component={SignUp} path="/signup" />
        <Route component={UserFind} path="/userfind/:user" />
        <PrivateRoute exact component={WatchedUserPosts} path="/" />
        <PrivateRoute component={User} path="/user" />
        <PrivateRoute component={PostCreate} path="/postcreate" />
        <PrivateRoute component={EmailChange} path="/emailchange" />
        <PrivateRoute component={PasswordChange} path="/passwordchange" />
        <Route component={PublicUserProfile} path="/userprofile/:id" />
        <PrivateRoute component={DescriptionChange} path="/descriptionchange" />
        <PrivateRoute component={UserEditPanel} path="/useredits" />
        <PrivateRoute component={UserInfoEdit} path="/edit/:id" />
        <PrivateRoute component={UserPosts} path="/userposts/:id" />
        <PrivateRoute component={UserComments} path="/userallcomment/:id" />
        <PrivateRoute component={Posts} path="/posts" />
        <PrivateRoute component={Comments} path="/comments" />
        <PrivateRoute component={UserSettings} path="/usersettings" />
        <PrivateRoute component={AdminPanel} path="/adminpanel" />
      </div>
    </Provider>
  );
}

export default App;
