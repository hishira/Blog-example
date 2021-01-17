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
  Select,
} from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { getUserInfo } from "../../../api/userApi";
import DescriptionModal from "./descriptionModal";
import { inject, observer } from "mobx-react";
import CommentModal from "../../comment/commentModal";
import PostComments from "../../comment/commentsForPost";
import EditPostModal from "../../post/editPostModal";
import DeletePostModal from "../../post/deletePostModal";
import ChangePostTypeModal from "../../post/changePostType";
import {
  likePost,
  removeLikePost,
  sortPost,
  sortPostByLikes,
} from "../../../api/postApi";
import UserPostComponent from "./userPostComponent";
import WatchedUsersModal from "./watchedUserModal";
import LoadingComponent from "../../shared/loadingComponent";
import cssobject from "./css/User";
import UserInfoCard from './UserInfoCard'
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
  const [sortOption, setSortOption] = useState("");
  
  const sortOptions = [
    { key: "date_ascending", value: "date_ascending", text: "Ascending date" },
    {
      key: "date_descending",
      value: "date_descending",
      text: "Descending date",
    },
    {
      key: "post_likes",
      value: "post_likes",
      text: "Post likes",
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
    let obj = { userID: props.userStore.getLogedUser._id };
    let res = await likePost(post._id, obj).then((response) => {
      if (response.status === 200) return true;
      else return false;
    });
    if (res) {
      let newUser = props.userStore.getLogedUser;
      for (let i in newUser.posts) {
        if (newUser.posts[i]._id === post._id)
          newUser.posts[i].likes.push(u._id);
      }
      props.userStore.setLogedUser(newUser);
    }
  };
  
  const unlikePostHandle = async (post, u) => {
    let obj = { userID: props.userStore.getLogedUser._id };
    let res = await removeLikePost(post._id, obj).then((response) => {
      if (response.status === 200) return true;
      else return false;
    });
    if (res) {
      let userRemove = props.userStore.getLogedUser;
      for (let i in userRemove.posts) {
        if (userRemove.posts[i]._id === post._id) {
          let index = userRemove.posts[i].likes.indexOf(userRemove._id);
          console.log(index);
          if (index > -1) userRemove.posts[i].likes.splice(index, 1);
        }
      }
      console.log(userRemove);
      props.userStore.setLogedUser(userRemove);
    }
  };
  
  const sortHandle = async () => {
    console.log(sortOption);
    if (sortOption === "") return;
    let obj = {
      userID: props.userStore.getLogedUser._id,
      sortOption: sortOption,
    };
    console.log(obj);
    if (sortOption === "post_likes") {
      let res = await sortPostByLikes(obj).then((response) => {
        if (response.status === 200) return response.json();
        return false;
      });
      if (res !== false) {
        props.userStore.setLogedUserPost(res);
      }
      return;
    }
    let res = await sortPost(obj).then((response) => {
      if (response.status === 200) return response.json();
      return false;
    });
    if (res !== false) {
      props.userStore.setLogedUserPost(res);
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
        props.userStore.setLogedUser(userFromRequest);
        setUser(userFromRequest);
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
    <div style={cssobject.margin}>
      <div>
        <Grid columns={1}>
          <Grid.Row>
            <Grid.Column>
              {loading === "false" ? (
                <LoadingComponent />
              ) : loading === "error" ? (
                <div>Error</div>
              ) : (
                <UserInfoCard/>
              )}
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
        <div style={cssobject.normaldivstyle}>
          <Button color="teal" onClick={() => history.push("/postcreate")}>
            Create post
          </Button>
          <Container style={cssobject.containermargintop}>
            <Select
              placeholder="Sort by"
              options={sortOptions}
              onChange={(e, { value }) => setSortOption(value)}
            />
            <Button onClick={() => sortHandle()} style={cssobject.buttonmargin}>
              Sort posts
            </Button>
          </Container>
          {props.userStore.getLogedUser.posts.map((post) => (
            <UserPostComponent
              post={post}
              editPostHandle={editPostHandle}
              deletePosthandle={deletePosthandle}
              changePostTypeHandle={changePostTypeHandle}
              commentForPostHandle={commentForPostHandle}
              unlikePostHandle={unlikePostHandle}
              likePostHandle={likePostHandle}
              commentHandle={commentHandle}
            />
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
      {loading === "false" ? (
        <div />
      ) : loading === "error" ? (
        <div />
      ) : (
        <WatchedUsersModal user={user} />
      )}
    </div>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
  userStore: stores.userStore,
}))(observer(User));
