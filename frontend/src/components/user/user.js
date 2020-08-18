import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Divider,
  Card,
  Loader,
  Segment,
  Dimmer,
  Icon,
  Container,
} from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { getUserInfo } from "../../api/userApi";
import DescriptionModal from "./descriptionModal";
import { inject, observer } from "mobx-react";
import CommentModal from "../comment/commentModal";
import PostComments from "../comment/commentsForPost";
import EditPostModal from "../post/editPostModal";
import DeletePostModal from "../post/deletePostModal";
import ChangePostTypeModal from "../post/changePostType";
import { likePost, removeLikePost } from "../../api/postApi";

function User(props) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState("false");
  const [modalOpen, setModalOpen] = useState(false);
  const [postComment, setPropsComment] = useState({});
  const [commentsForPost, setCommentsForPost] = useState([]);
  const [editPost, setEditPost] = useState({});
  const [postIdToDelete, setPostIdToDelete] = useState({});
  const [postIdToTypechange, setPostIdToTypeChange] = useState({});
  const [postTypeRevert, setPostTypeRevert] = useState("");
  const commentHandle = (post) => {
    setPropsComment(post);
    props.mainStore.setCommentModal(true);
  };
  const commentForPostHandle = (postid) => {
    console.log(postid);
    setCommentsForPost(postid);
    props.mainStore.setCommentsForPost(true);
  };
  const editPostHandle = (post) => {
    setEditPost(post);
    props.mainStore.setEditPostModal(true);
  };
  const deletePosthandle = (post) => {
    setPostIdToDelete(post._id);
    props.mainStore.setDeletePostModal(true);
  };
  const changePostTypeHandle = (post) => {
    setPostIdToTypeChange(post._id);
    setPostTypeRevert(post.postType === "PUBLIC" ? "private" : "public");
    props.mainStore.setEditTypePostModal(true);
  };
  const likePostHandle = async (post, u) => {
    let obj = {userID:props.userStore.getLogedUser._id}
    let res = await likePost(post._id,obj).then((response) => {
      if (response.status === 200) return true;
      else return false;
    });
    if (res) {
      let newUser = props.userStore.getLogedUser;
      for (let i in newUser.posts) {
        if (newUser.posts[i]._id === post._id)
          newUser.posts[i].likes.push(u._id);
      }
      props.userStore.setLogedUser(newUser)
    }
  };
  const unlikePostHandle = async (post, u) => {
    let obj = {userID:props.userStore.getLogedUser._id}
    let res = await removeLikePost(post._id,obj).then((response) => {
      if (response.status === 200) return true;
      else return false;
    });
    if (res) {
      let userRemove = props.userStore.getLogedUser;
      for (let i in userRemove.posts) {
        if (userRemove.posts[i]._id === post._id) {
          let index = userRemove.posts[i].likes.indexOf(userRemove._id);
          console.log(index)
          if (index > -1) userRemove.posts[i].likes.splice(index, 1);
        }
      }
      console.log(userRemove)
      props.userStore.setLogedUser(userRemove)
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userFromRequest = await getUserInfo().then((request) => {
          if (request.status === 200) return request.json();
          else return null;
        });
        if (userFromRequest === null) throw new Error("Err");
        props.userStore.setLogedUser(userFromRequest)
        setLoading("true");
        console.log(userFromRequest);
      } catch (err) {
        setLoading("error");
      }
    };
    fetchData();
  }, props.userStore.getLogedUser);
  const history = useHistory();
  return (
    <div style={{ margin: ".5rem" }}>
      <div>
        <Grid stackable columns={2}>
          <Grid.Row>
            <Grid.Column width={3}>
              {loading === "false" ? (
                <Segment>
                  <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                  </Dimmer>
                </Segment>
              ) : loading === "error" ? (
                <div>Error</div>
              ) : (
                <Card
                  style={{
                    widht: "20rem",
                    marginRight: "auto",
                    marginLeft: "auto",
                  }}
                >
                  <Card.Content>
                    <Icon name="user" size="large" />
                    <Card.Header
                      style={{ marginTop: "1rem", fontSize: "1.1rem" }}
                    >
                      Username: {props.userStore.getLogedUser.username}
                      <br />
                      Email: {props.userStore.getLogedUser.email}
                    </Card.Header>
                    {props.userStore.getLogedUser.description !== "" ? (
                      <Card.Description>
                        Opis:{props.userStore.getLogedUser.description}
                      </Card.Description>
                    ) : (
                      <Button
                        size="tiny"
                        onClick={() => props.mainStore.setModal(true)}
                      >
                        Add description
                      </Button>
                    )}
                  </Card.Content>
                </Card>
              )}
            </Grid.Column>
            <Grid.Column width={13}>
              <Button.Group widths="4">
                <Button onClick={() => history.push("/emailchange")} animated>
                  <Button.Content visible>Email</Button.Content>
                  <Button.Content hidden>Change Email</Button.Content>
                </Button>
                <Button onClick={() => history.push("/postcreate")} animated>
                  <Button.Content visible>Post</Button.Content>
                  <Button.Content hidden>Create Post</Button.Content>
                </Button>
                <Button
                  onClick={() => history.push("/passwordchange")}
                  animated
                >
                  <Button.Content visible>Password</Button.Content>
                  <Button.Content hidden>Password Change</Button.Content>
                </Button>
                <Button
                  onClick={() => history.push("/descriptionchange")}
                  animated
                >
                  <Button.Content visible>Description</Button.Content>
                  <Button.Content hidden>Description Change</Button.Content>
                </Button>
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <DescriptionModal open={modalOpen} />
      {loading === "false" ? (
        <Segment>
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Segment>
      ) : loading === "error" ? (
        <div>Error</div>
      ) : (
        <div
          style={{
            marginTop: "2.5rem",
            maxWidth: "80rem",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          {props.userStore.getLogedUser.posts.map((post) => (
            <Card
              style={{ marginRight: "auto", marginLeft: "auto", width: "100%" }}
            >
              <Card.Content>
                <Card.Header>
                  <div>{post.title}</div>
                  <br />
                  <Button.Group>
                    <Button size="tiny" onClick={() => editPostHandle(post)}>
                      Edit post
                    </Button>
                    <Button.Or size="tiny" />
                    <Button size="tiny" onClick={() => deletePosthandle(post)}>
                      Delete
                    </Button>
                    <Button.Or />
                    {post.postType === "PUBLIC" ? (
                      <Button
                        onClick={() => changePostTypeHandle(post)}
                        size="tiny"
                      >
                        Make post private
                      </Button>
                    ) : (
                      <Button
                        onClick={() => changePostTypeHandle(post)}
                        size="tiny"
                      >
                        Make post public
                      </Button>
                    )}
                  </Button.Group>
                </Card.Header>
                <Card.Description style={{ marginTop: "2rem" }}>
                  {post.content}
                </Card.Description>
              </Card.Content>

              <Card.Content extra>
                <a
                  style={{ marginRight: ".5rem" }}
                  onClick={() => commentForPostHandle(post._id)}
                >
                  <Icon name="comment" />
                  {post.comments.length}
                </a>
                {post.likes.includes(props.userStore.getLogedUser._id) ? (
                  <a onClick={() => unlikePostHandle(post, user)}>
                    <Icon style={{ color: "red" }} name="like" />
                    {post.likes.length}
                  </a>
                ) : (
                  <a onClick={() => likePostHandle(post, user)}>
                    <Icon name="like" />
                    {post.likes.length}
                  </a>
                )}
                <Button
                  style={{ marginLeft: "1.5rem" }}
                  basic
                  color="blue"
                  onClick={() => commentHandle(post)}
                >
                  Add comment
                </Button>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
      <CommentModal post={postComment} />
      <PostComments postid={commentsForPost} />
      <EditPostModal post={editPost} />
      <DeletePostModal id={postIdToDelete} />
      <ChangePostTypeModal
        id={postIdToTypechange}
        typeToChange={postTypeRevert}
      />
    </div>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
  userStore: stores.userStore
}))(observer(User));
