import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Card,
  Loader,
  Segment,
  Dimmer,
  Grid,
  Icon
} from "semantic-ui-react";
import { getPublicUserInfo } from "../../api/userApi";
import { inject, observer } from "mobx-react";
import CommentModal from "../comment/commentModal";
import PostComments from "../comment/commentsForPost";

function PublicUserProfile(props) {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState("false");
  const [postComment, setPropsComment] = useState({});
  const [commentsForPost, setCommentsForPost] = useState([]);
  const commentHandle = (post) => {
    setPropsComment(post);
    props.mainStore.setCommentModal(true);
  };
  const commentForPostHandle = (postid) => {
    console.log(postid);
    setCommentsForPost(postid);
    props.mainStore.setCommentsForPost(true);
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
        setUserInfo(data);
        setLoading("true");
        console.log(data);
      } catch (err) {
        setLoading("error");
        return;
      }
    };
    fetchData();
  }, [props.match.params.id]);
  return (
    <div style={{ marginTop: ".5rem" }}>
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
                <Grid.Column width={3}>
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
                      Username: {userInfo.username}
                      <br/>
                      Email: {userInfo.email}
                    </Card.Header>
                    {userInfo.description !== "" ? (
                      <Card.Description>
                        Opis:{userInfo.description}
                      </Card.Description>
                    ) : (
                      <div></div>
                    )}
                  </Card.Content>
                </Card>
                </Grid.Column>
                <Grid.Column width={12}>
                  {userInfo.posts.map(post=>(
                    <Card
                    style={{ marginRight: "auto", marginLeft: "auto", width: "100%" }}
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
        </div>
        
      )}
    </div>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
}))(observer(PublicUserProfile));