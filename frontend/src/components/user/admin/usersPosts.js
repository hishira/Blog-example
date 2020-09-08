import React, { useState, useEffect } from "react";
import {
  Container,
  Segment,
  Dimmer,
  Loader,
  Button,
  Card,
  Icon,
  Label,
} from "semantic-ui-react";
import { getUserPosts } from "../../../api/adminApi";
import {deletePost} from '../../../api/postApi'
import { useHistory } from "react-router-dom";
import EditPostModal from "../../post/editPostModal";
import { inject, observer } from "mobx-react";

function UserPosts(props) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState("false");
  const [editPost, setEditPost] = useState({});
  const history = useHistory();

  const deletePostHandle = async (postID)=>{
      console.log(postID)
      let data = await deletePost(postID).then(response=>{
          if(response.status === 200)
            return true
            return false
      })
      if (data == true)
        history.push("/user")

  }
  const editPostHandle = (post) =>{
    setEditPost(post);
    props.mainStore.setEditPostModal(true);
  }
  useEffect(() => {
    let id = props.match.params.id;
    console.log(id);
    const fetchData = async () => {
      try {
        const data = await getUserPosts(id).then((response) => {
          if (response.status === 200) return response.json();
          return null;
        });
        if (data === null) throw new Error("Error");
        setPosts(data);
        setLoading("true");
      } catch (err) {
        setLoading("error");
      }
    };
    fetchData();
  }, []);
  return (
    <Container>
      {loading === "false" ? (
        <Segment>
          <Dimmer active inverted>
            <Loader inverted>Loading...</Loader>
          </Dimmer>
        </Segment>
      ) : loading === "error" ? (
        <div>Error</div>
      ) : (
        <div>
          {posts.map((post) => (
            <Card
              style={{ marginRight: "auto", marginLeft: "auto", width: "100%" }}
            >
              <Card.Content>
                <Card.Header>
                  <div>{post.title}</div>
                  <Card.Meta style={{ marginTop: ".5rem" }}>
                    Create: {post.createDate.split("T")[0]}
                  </Card.Meta>
                  <br />
                  <Button.Group>
                    <Button size="tiny" onClick={() => editPostHandle(post)}>Edit post</Button>
                    <Button.Or size="tiny" />
                    <Button size="tiny" onClick={() => deletePostHandle(post._id)}>Delete</Button>
                  </Button.Group>
                </Card.Header>
                <Card.Description style={{ marginTop: "2rem" }}>
                  {post.content}
                </Card.Description>
                Tags: <br />
                {post.tags.map((tag) => (
                  <Label>{tag}</Label>
                ))}
              </Card.Content>

              <Card.Content style={{ padding: ".5rem" }} extra>
                <a style={{ marginRight: ".5rem" }}>
                  <Icon name="comment" />
                  {post.comments.length}
                </a>

                <a>
                  <Icon name="like" />
                  {post.likes.length}
                </a>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
      <EditPostModal post={editPost} />
    </Container>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
}))(observer(UserPosts));