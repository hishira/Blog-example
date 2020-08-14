import React, { useEffect, useState } from "react";
import {
  Modal,
  Container,
  Loader,
  Segment,
  Dimmer,
  Comment,
  Header,
} from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { getCommentsByPost } from "../../api/commentApi";
function PostComments(props) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState("false");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const commentsrequest = await getCommentsByPost({
          postID: props.postid,
        }).then((res) => {
          if (res.status === 200) {
            return res.json();
          } else return null;
        });
        if (commentsrequest === null) throw new Error("Err");
        setComments(commentsrequest);
        console.log(commentsrequest);
        setLoading("true");
      } catch (err) {
        setLoading("error");
      }
    };
    fetchData();
  }, [props.mainStore.postComments]);
  return (
    <Modal
      open={props.mainStore.postComments}
      onClose={() => props.mainStore.setCommentsForPost(false)}
      onOpen={() => props.mainStore.setCommentsForPost(true)}
    >
      <Modal.Header>Post Comments</Modal.Header>
      <Modal.Content scrolling>
        {loading === "false" ? (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
          </Segment>
        ) : loading === "error" ? (
          <div>Error</div>
        ) : (
          <Container>
            <Comment.Group>
              <Header as="h3">Comments</Header>
              {comments.map((comment) => (
                <Comment style={{position:"relative",left:".5rem",padding:".5rem"}}>
                  <Comment.Content>
                  {
                    comment.user?(
                      <div>
                    <Comment.Author>{comment.user.email}</Comment.Author>
                    <Comment.Metadata>
                      <div>{comment.createDate.split('T')[0]}</div>
                    </Comment.Metadata>
                    </div>
                    ):(
                      <div>
                      <Comment.Author>Anonymous</Comment.Author>
                      <Comment.Metadata>
                      <div>{comment.createDate.split('T')[0]}</div>
                      </Comment.Metadata>
                      </div>
                    )
                  }
                    <Comment.Text>{comment.content}</Comment.Text>
                  </Comment.Content>
                </Comment>
              ))}
            </Comment.Group>
          </Container>
        )}
      </Modal.Content>
    </Modal>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
}))(observer(PostComments));
