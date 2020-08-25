import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Card,
  Loader,
  Segment,
  Dimmer,
  Grid,
  Icon,
  Select,
} from "semantic-ui-react";
import { getPublicUserInfo } from "../../api/userApi";
import { inject, observer } from "mobx-react";
import CommentModal from "../comment/commentModal";
import PostComments from "../comment/commentsForPost";
import { likePost, removeLikePost, sortPost } from "../../api/postApi";
import Cookies from "js-cookie";
import Response from "../shared/response";
import LoginModal from "../auth/loginModal" 
function PublicUserProfile(props) {
  const [loggedUser, setLoggedUser] = useState(Cookies.getJSON("user"));
  const [loading, setLoading] = useState("false");
  const [postComment, setPropsComment] = useState({});
  const [commentsForPost, setCommentsForPost] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sortOption, setSortOption] = useState("");
  const sortOptions = [
    { key: "date_ascending", value: "date_ascending", text: "Ascending date" },
    {
      key: "date_descending",
      value: "date_descending",
      text: "Descending date",
    },
  ];
  const commentHandle = (post) => {
    setPropsComment(post);
    props.mainStore.setCommentModal(true);
  };
  const commentForPostHandle = (postid) => {
    console.log(postid);
    setCommentsForPost(postid);
    props.mainStore.setCommentsForPost(true);
  };
  const likePostHandle = async (post, u) => {
    if (!props.mainStore.getLogStatus) {
      props.mainStore.setLoginModal(true)
      return;
    }
    console.log("Old Post");
    console.log(post);
    console.log(props.userStore.getLogedUser._id);
    let obj = { userID: props.userStore.getLogedUser._id };

    let res = await likePost(post._id, obj).then((response) => {
      if (response.status === 200) return true;
      else return false;
    });
    if (res) {
      let newUser = props.userStore.getWatchedUser;
      for (let i in newUser.posts) {
        if (newUser.posts[i]._id === post._id)
          newUser.posts[i].likes.push(u._id);
      }
      props.userStore.setWatchedUser(newUser);
    }
  };
  const unlikePostHandle = async (post, u) => {
    let obj = { userID: props.userStore.getLogedUser._id };

    let res = await removeLikePost(post._id, obj).then((response) => {
      if (response.status === 200) return true;
      else return false;
    });
    if (res) {
      let userRemove = props.userStore.getWatchedUser;
      for (let i in userRemove.posts) {
        if (userRemove.posts[i]._id === post._id) {
          let index = userRemove.posts[i].likes.indexOf(loggedUser._id);
          if (index > -1) userRemove.posts[i].likes.splice(index, 1);
        }
      }
      props.userStore.setWatchedUser(userRemove);
    }
  };
  const sortHandle = async () => {
    console.log(sortOption);
    if (sortOption === "") return;
    let obj = {
      userID: props.userStore.getWatchedUser._id,
      sortOption: sortOption,
    };
    console.log(obj);
    let res = await sortPost(obj).then((response) => {
      if (response.status === 200) return response.json();
      return false;
    });
    if (res !== false) {
      props.userStore.setWatchedUserPost(res);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await getPublicUserInfo(props.match.params.id).then(
          (response) => {
            if (response.status === 200) return response.json();
            return null;
          }
        );
        if (data === null) throw new Error("Problem");
        props.userStore.setWatchedUser(data);
        setLoading("true");
      } catch (err) {
        setLoading("error");
        return;
      }
    };
    setLoggedUser(Cookies.getJSON("user"));
    fetchData();
  }, [props.match.params.id]);
  return (
    <div style={{ marginTop: ".5rem" }}>
      <Response open={open} message={message} />
      {loading === "false" ? (
        <Segment>
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Segment>
      ) : loading === "error" ? (
        <div>Error</div>
      ) : (
        <div>
          <Grid stackable columns={2}>
            <Grid.Column style={{padding:"1.5rem"}} width={3}>
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
              </Card>
            </Grid.Column>

            <Grid.Column width={12}>
              <Container style={{marginBottom:"3rem"}}>
                <Select
                  placeholder="Sort by"
                  options={sortOptions}
                  onChange={(e, { value }) => setSortOption(value)}
                />
                <Button
                  onClick={() => sortHandle()}
                  style={{ marginLeft: "1.5rem" }}
                >
                  Sort posts
                </Button>
              </Container>
              {props.userStore.getWatchedUser.posts.map((post) => (
                <Card
                  style={{
                    marginRight: "auto",
                    marginLeft: "auto",
                    width: "100%",
                  }}
                >
                  <Card.Content>
                    <Card.Header>{post.title}</Card.Header>
                    <Card.Description>{post.content}</Card.Description>
                  </Card.Content>

                  <Card.Content extra>
                    <a onClick={() => commentForPostHandle(post._id)}>
                      <Icon name="comment" />
                      {post.comments.length}
                    </a>
                    {loggedUser && post.likes.includes(loggedUser._id) ? (
                      <a onClick={() => unlikePostHandle(post, loggedUser)}>
                        <Icon style={{ color: "red" }} name="like" />
                        {post.likes.length}
                      </a>
                    ) : (
                      <a onClick={() => likePostHandle(post, loggedUser)}>
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
            </Grid.Column>
          </Grid>
          <CommentModal post={postComment} />
          <PostComments postid={commentsForPost} />
          <LoginModal />
        </div>
      )}
    </div>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
  userStore: stores.userStore,
}))(observer(PublicUserProfile));
