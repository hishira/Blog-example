import React from "react";
import { inject, observer } from "mobx-react";
import { Button, Card, Icon, Label } from "semantic-ui-react";
import cssobject from "./css/UserPostComponent";
function UserPostComponent(props) {
  return (
    <Card style={cssobject.card}>
      <Card.Content>
        <Card.Header>
          <div>{props.post.title}</div>
          <Card.Meta style={cssobject.cardheadermeta}>
            Create: {props.post.createDate.split("T")[0]}
          </Card.Meta>
          <br />
          <Button.Group style={cssobject.butttongroup}>
            <Button
              size="tiny"
              style={cssobject.editbutton}
              onClick={() => props.editPostHandle(props.post)}
            >
              Edit
            </Button>

            <Button
              size="tiny"
              icon="delete"
              style={cssobject.marginright}
              onClick={() => props.deletePosthandle(props.post)}
            />
            {props.post.postType === "PUBLIC" ? (
              <Button
                onClick={() => props.changePostTypeHandle(props.post)}
                size="tiny"
                style={cssobject.privatebutton}
              >
                Make private
              </Button>
            ) : (
              <Button
                onClick={() => props.changePostTypeHandle(props.post)}
                size="tiny"
                style={cssobject.width4rem}
              >
                Make public
              </Button>
            )}
          </Button.Group>
        </Card.Header>
        <Card.Description style={cssobject.marginTop}>
          {props.post.content}
        </Card.Description>
        Tags: <br />
        {props.post.tags.map((tag) => (
          <Label>{tag}</Label>
        ))}
      </Card.Content>

      <Card.Content style={cssobject.cardcontent} extra>
        <a
          style={cssobject.carda}
          onClick={() => props.commentForPostHandle(props.post._id)}
        >
          <Icon name="comment" />
          {props.post.comments.length}
        </a>
        {props.post.likes.includes(props.userStore.getLogedUser._id) ? (
          <a
            onClick={() =>
              props.unlikePostHandle(props.post, props.userStore.getLogedUser)
            }
          >
            <Icon style={cssobject.cardicon} name="like" />
            {props.post.likes.length}
          </a>
        ) : (
          <a
            onClick={() =>
              props.likePostHandle(props.post, props.userStore.getLogedUser)
            }
          >
            <Icon name="like" />
            {props.post.likes.length}
          </a>
        )}
        <Button
          style={cssobject.cardbutton}
          basic
          color="blue"
          onClick={() => props.commentHandle(props.post)}
        >
          Add comment
        </Button>
      </Card.Content>
    </Card>
  );
}

export default inject((stores) => ({
  mainStore: stores.mainStore,
  userStore: stores.userStore,
}))(observer(UserPostComponent));
