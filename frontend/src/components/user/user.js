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
import CommentModal from "./commentModal";
import PostComments from "./commentsForPost";
import EditPostModal from "./editPostModal"
function User(props) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState("false");
  const [modalOpen, setModalOpen] = useState(false);
  const [postComment, setPropsComment] = useState({});
  const [commentsForPost, setCommentsForPost] = useState([]);
  const [editPost,setEditPost] = useState({})
  const commentHandle = (post) => {
    setPropsComment(post);
    props.mainStore.setCommentModal(true);
  };
  const commentForPostHandle = (postid) => {
    console.log(postid);
    setCommentsForPost(postid);
    props.mainStore.setCommentsForPost(true);
  };
  const editPostHandle = (post)=>{
    setEditPost(post)
    props.mainStore.setEditPostModal(true)

  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userFromRequest = await getUserInfo().then((request) => {
          if (request.status === 200) return request.json();
          else return null;
        });
        if (userFromRequest === null) throw new Error("Err");
        setUser(userFromRequest);
        setLoading("true");
        console.log(userFromRequest);
      } catch (err) {
        setLoading("error");
      }
    };
    fetchData();
  }, []);
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
                      Username: {user.username}
                      <br />
                      Email: {user.email}
                    </Card.Header>
                    {user.description !== "" ? (
                      <Card.Description>
                        Opis:{user.description}
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
              <Button.Group widths="3">
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
          {user.posts.map((post) => (
            <Card
              style={{ marginRight: "auto", marginLeft: "auto", width: "100%" }}
            >
              <Card.Content>
                <Card.Header>{post.title}
                <Button.Group style={{position:"absolute",top:".5rem",right:".5rem"}}>
                  <Button onClick={() =>editPostHandle(post)}>Edit post</Button>
                  <Button.Or/>
                  <Button>Delete</Button>
                </Button.Group></Card.Header>
                <Card.Description style={{marginTop:"2rem"}}>{post.content}</Card.Description>
              </Card.Content>

              <Card.Content extra>
                <a onClick={() => commentForPostHandle(post._id)}>
                  <Icon name="comment" />
                  {post.comments.length}
                </a>
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
      <EditPostModal post={editPost}/>
    </div>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
}))(observer(User));
