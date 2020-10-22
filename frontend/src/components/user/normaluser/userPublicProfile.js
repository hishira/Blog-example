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
  Label,
} from "semantic-ui-react";
import {
  getPublicUserInfo,
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
import UserPublicInfoCard from './UserPublicInfoCard'
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
  const history = useHistory();

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
      props.mainStore.setLoginModal(true);
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
      if (
        props.mainStore.getLogStatus &&
        props.userStore.getLogedUser._id === props.match.params.id
      ) {
        history.push("/user");
        return;
      }
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
    <div style={cssobject.margintop}>
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
          <Grid columns={1}>
            <Grid.Column style={cssobject.publicprofilegrid}>
              <UserPublicInfoCard/>
            </Grid.Column>
          </Grid>
          <Container style={cssobject.publicprofilecontainer}>
            <Select
              placeholder="Sort by"
              options={sortOptions}
              onChange={(e, { value }) => setSortOption(value)}
            />
            <Button onClick={() => sortHandle()} style={cssobject.cardbutton}>
              Sort posts
            </Button>
          </Container>
          {props.userStore.getWatchedUser.posts.map((post) => (
            <Card style={cssobject.card}>
              <Card.Content>
                <Card.Header>{post.title}</Card.Header>
                <Card.Description>{post.content}</Card.Description>
              </Card.Content>
              <Container style={cssobject.cardcontainer}>
                <span style={cssobject.bluespan}>#</span>
                {post.tags.map((tag) => (
                  <Label>{tag}</Label>
                ))}
              </Container>
              <Card.Content style={cssobject.cardcontent} extra>
                <a
                  style={cssobject.carda}
                  onClick={() => commentForPostHandle(post._id)}
                >
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
                  style={cssobject.cardbutton}
                  basic
                  color="blue"
                  onClick={() => commentHandle(post)}
                >
                  Add comment
                </Button>
              </Card.Content>
            </Card>
          ))}
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
