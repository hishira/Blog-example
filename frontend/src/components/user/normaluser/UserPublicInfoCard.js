import React from "react";
import { Button, Card, Icon } from "semantic-ui-react";
import {
  getPublicUserInfo,
  watchUser,
  unwatchUser,
} from "../../../api/userApi";
import { inject, observer } from "mobx-react";
import CommentModal from "../../comment/commentModal";
import PostComments from "../../comment/commentsForPost";
import { likePost, removeLikePost, sortPost } from "../../../api/postApi";
import Cookies from "js-cookie";
import Response from "../../shared/response";
import LoginModal from "../../auth/loginModal";
import { useHistory } from "react-router-dom";
import cssobject from "./css/UserPostComponent";
function UserPublicInfoCard(props) {
  const checkWatchedMe = () => {
    console.log(props.userStore.getLogedUser);
    return (
      props.mainStore.getLogStatus &&
      props.userStore.getLogedUser.watched.includes(
        props.userStore.getWatchedUser._id
      )
    );
  };
  const watchUserHandle = async () => {
    let obj = { userID: props.userStore.getWatchedUser._id };
    console.log(obj);
    let req = await watchUser(obj).then((response) => {
      if (response.status === 200) return response.json();
      return false;
    });
    if (req !== false) {
      props.userStore.setLogedUser(req);
    }
  };
  const unWatchUserHandle = async () => {
    let obj = { userID: props.userStore.getWatchedUser._id };
    console.log(obj);
    let req = await unwatchUser(obj).then((response) => {
      if (response.status === 200) return response.json();
      return false;
    });
    if (req !== false) {
      props.userStore.setLogedUser(req);
    }
  };
  return (
  <Card style={cssobject.publicprofilecard}>
    <Card.Content style={{width:"40rem"}}>
      <Icon name="user" size="large" />
      <Card.Header style={cssobject.publicprofilecardheader}>
        Username: {props.userStore.getWatchedUser.username}
        <br />
        Email: {props.userStore.getWatchedUser.email}
      </Card.Header>
      {props.userStore.getWatchedUser.description !== "" ? (
        <Card.Description>
          Opis:{props.userStore.getWatchedUser.description}
        </Card.Description>
      ) : (
        <div></div>
      )}
    </Card.Content>
    <Card.Content>
      {checkWatchedMe() ? (
        <Button
          color="blue"
          basic
          size="small"
          content="Unwatch"
          icon="add user"
          onClick={() => unWatchUserHandle()}
        />
      ) : props.mainStore.getLogStatus ? (
        <Button
          color="blue"
          basic
          size="small"
          content="Watch"
          icon="add user"
          onClick={() => watchUserHandle()}
        />
      ) : (
        <Button
          color="blue"
          basic
          size="small"
          content="Watch"
          icon="add user"
          onClick={() => props.mainStore.setLoginModal(true)}
        />
      )}
    </Card.Content>
  </Card>);
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
  userStore: stores.userStore,
}))(observer(UserPublicInfoCard));
