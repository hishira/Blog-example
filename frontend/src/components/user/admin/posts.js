import React, { useState, useEffect } from "react";
import { Container, Button, Card, Icon, Label } from "semantic-ui-react";
import Loading from "../../shared/loadingComponent";
import { getAllPosts } from "../../../api/adminApi";
import {deletePost} from '../../../api/postApi'
import { useHistory } from "react-router-dom";
import EditPostModal from "../../post/editPostModal";
import { inject, observer } from "mobx-react";
import "./admin.css"

function Posts(props) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState("false");
  const [dataChange, setDataChange] = useState(false);
  const [editPost, setEditPost] = useState({});
  const history = useHistory();

  const deletePostHandle = async (postID) => {
    console.log(postID);
    let data = await deletePost(postID).then((response) => {
      if (response.status === 200) return true;
      return false;
    });
    if (data == true){
        setDataChange(!dataChange)
        history.push(`/posts`)
        return
    };
  };
  const editPostHandle = (post) =>{
    setEditPost(post);
    props.mainStore.setEditPostModal(true);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        let dataPosts = await getAllPosts().then((response) => {
          if (response.status === 200) return response.json();
          return null;
        });
        if (dataPosts === null) throw new Error("err");
        setPosts(dataPosts);
        setLoading("true");
      } catch (err) {
        setLoading("error");
      }
    };
    fetchData();
  }, [dataChange]);
  return (
    <Container>
      {loading === "false" ? (
        <Loading />
      ) : loading === "error" ? (
        <div>Error</div>
      ) : (
        <div className="postEdit">
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
                </Card.Header>
                <Card.Description style={{ marginTop: ".5rem" }}>
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
                <br />
                <Button.Group>
                  <Button size="tiny" onClick={() => editPostHandle(post)}>
                    Edit post
                  </Button>
                  <Button.Or size="tiny" />
                  <Button
                    size="tiny" onClick={() => deletePostHandle(post._id)}
                  >
                    Delete
                  </Button>
                </Button.Group>
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
  }))(observer(Posts));