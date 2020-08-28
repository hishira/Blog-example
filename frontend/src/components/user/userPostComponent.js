import React from "react";
import { inject, observer } from "mobx-react";
import { Button, Card, Icon,Label } from "semantic-ui-react";
function UserPostComponent(props) {
  return (
    <Card style={{ marginRight: "auto", marginLeft: "auto", width: "100%" }}>
      <Card.Content>
        <Card.Header>
          <div>{props.post.title}</div>
            <Card.Meta style={{marginTop:".5rem"}}>Create: {props.post.createDate.split("T")[0]}</Card.Meta>
          <br />
          <Button.Group>
            <Button size="tiny" onClick={() => props.editPostHandle(props.post)}>
              Edit post
            </Button>
            <Button.Or size="tiny" />
            <Button size="tiny" onClick={() => props.deletePosthandle(props.post)}>
              Delete
            </Button>
            <Button.Or />
            {props.post.postType === "PUBLIC" ? (
              <Button
                onClick={() => props.changePostTypeHandle(props.post)}
                size="tiny"
              >
                Make post private
              </Button>
            ) : (
              <Button
                onClick={() => props.changePostTypeHandle(props.post)}
                size="tiny"
              >
                Make post public
              </Button>
            )}
          </Button.Group>
        </Card.Header>
        <Card.Description style={{ marginTop: "2rem" }}>
          {props.post.content}
        </Card.Description>
          Tags: <br/>
          {
            props.post.tags.map((tag)=>
              <Label>
                {tag}
              </Label>
            )
          }
      </Card.Content>

      <Card.Content extra>
        <a
          style={{ marginRight: ".5rem" }}
          onClick={() => props.commentForPostHandle(props.post._id)}
        >
          <Icon name="comment" />
          {props.post.comments.length}
        </a>
        {props.post.likes.includes(props.userStore.getLogedUser._id) ? (
          <a onClick={() => props.unlikePostHandle(props.post, props.userStore.getLogedUser)}>
            <Icon style={{ color: "red" }} name="like" />
            {props.post.likes.length}
          </a>
        ) : (
          <a onClick={() => props.likePostHandle(props.post, props.userStore.getLogedUser)}>
            <Icon name="like" />
            {props.post.likes.length}
          </a>
        )}
        <Button
          style={{ marginLeft: "1.5rem" }}
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
