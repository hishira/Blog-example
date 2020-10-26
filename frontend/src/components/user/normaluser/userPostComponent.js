import React from "react";
import { inject, observer } from "mobx-react";
import { Button, Card, Container, Icon, Label } from "semantic-ui-react";
import cssobject from "./css/UserPostComponent";
import "./css/postcomponent.css";
function UserPostComponent(props) {
  let editVariable = false;
  const editclickhandle = () => {
    if (!editVariable) {
      let elements = document.getElementsByClassName(props.post._id);
      for (let i of elements) {
        i.classList.remove("animateoff");
        i.classList.add("animateclass");
      }
      editVariable = !editVariable;
    } else {
      let elements = document.getElementsByClassName(props.post._id);
      for (let i of elements) {
        i.classList.remove("animateclass");
        i.classList.add("animateoff");
      }
      editVariable = !editVariable;
    }
  };
  return (
    <Card style={cssobject.card}>
      <Card.Content>
        <Card.Header>
          <div>{props.post.title}</div>
          <Card.Meta style={cssobject.cardheadermeta}>
            Create: {props.post.createDate.split("T")[0]}
          </Card.Meta>
          <br />
          <div className="editpostoptions">
            <div
              className="editpostoptions-title"
              onClick={() => editclickhandle()}
            >
              Edit options
            </div>
            <ul className={props.post._id + " hook"}>
              <li
                className={props.post._id + " clickhook"}
                onClick={() => props.editPostHandle(props.post)}
              >
                Edit
              </li>
              <li
                className={props.post._id + " clickhook"}
                onClick={() => props.deletePosthandle(props.post)}
              >
                Delete
              </li>
              {props.post.postType === "PUBLIC" ? (
                <li
                  className={props.post._id + " clickhook"}
                  onClick={() => props.changePostTypeHandle(props.post)}
                >
                  Make private
                </li>
              ) : (
                <li
                  className={props.post._id + " clickhook"}
                  onClick={() => props.changePostTypeHandle(props.post)}
                >
                  Make public
                </li>
              )}
            </ul>
          </div>
        </Card.Header>
        <Card.Description style={cssobject.marginTop}>
          {props.post.content}
        </Card.Description>
        {props.post.tags.length > 0 ? (
          <Container style={cssobject.tags}>
            Tags:
            {props.post.tags.map((tag) => (
              <Label style={cssobject.labelspan}>{tag}</Label>
            ))}
          </Container>
        ) : (
          <Container />
        )}
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
