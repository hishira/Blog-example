import React from "react";
import { Button, Card, Icon } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import cssobject from "./css/UserPostComponent";
import {watchUser,unWatchUser} from "../../../utils/user.util";

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
    const responseStatus = await watchUser(props.userStore.getWatchedUser._id)
    if (responseStatus !== false) {
      props.userStore.setLogedUser(responseStatus);
    }
  };
  
  const unWatchUserHandle = async () => {
    const responseStatus = await unWatchUser(props.userStore.getWatchedUser._id);
    if (responseStatus !== false) {
      props.userStore.setLogedUser(responseStatus);
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
