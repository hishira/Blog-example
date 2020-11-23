import React from "react";
import { inject, observer } from "mobx-react";
import {
  Button,
  Card,
  Icon,
}from "semantic-ui-react";
import cssobject from "./css/User";
import { useHistory } from "react-router-dom";

function UserInfoCard(props) {
    const history = useHistory();
  return (
    <Card style={cssobject.usercard}>
      <Card.Content style={cssobject.headerWidth}>
        <Icon name="user" size="large" />
        <Card.Header style={cssobject.usercardheader}>
          Username: {props.userStore.getLogedUser.username}
          <br />
          Email: {props.userStore.getLogedUser.email}
        </Card.Header>
        {props.userStore.getLogedUser.description !== "" ? (
          <Card.Description>
            {`${props.userStore.getLogedUser.description}`}
          </Card.Description>
        ) : (
          <Button size="tiny" onClick={() => props.mainStore.setModal(true)}>
            Add description
          </Button>
        )}
      </Card.Content>
      <Card.Content extra>
        <Button
          basic
          color="blue"
          content="Watched"
          icon="user"
          onClick={() => props.mainStore.setWatchedUserModal(true)}
          label={{
            as: "a",
            basic: true,
            color: "blue",
            pointing: "left",
            content: props.userStore.getLogedUser.watched.length,
          }}
        />
        <Button
          style={cssobject.buttonmarginleft}
          icon="settings"
          onClick={() => history.push("/usersettings")}
        />
        {props.userStore.getLogedUser.role === "ADMIN" ? (
          <Button
            style={cssobject.buttonmarginleft}
            icon="adn"
            onClick={() => history.push("/adminpanel")}
          />
        ) : (
          <div />
        )}
      </Card.Content>
    </Card>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
  userStore: stores.userStore,
}))(observer(UserInfoCard));
