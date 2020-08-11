import React, { useState } from "react";
import { Button, Modal, Form, TextArea } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import Response from "../shared/response";
import { createComment,createAnonymousComment } from "../../api/commentApi";
import { useHistory } from "react-router-dom";
function CommentModal(props) {
  const [commentContent, setCommentContent] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();
  const submitHandle = async (e) => {
    e.preventDefault();
    console.log(props.post._id);
    if (commentContent === "") {
      setMessage("Comment cannot be empty");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 1500);
      return;
    }
    let obj = {
      content: commentContent,
      postID: props.post._id,
    };
    let flag = false;
    if (props.mainStore.getLogStatus) {
      let response = await createComment(obj).then((response) => {
        if (response.status === 200) {
          flag = true;
        } else {
          setMessage("Comment cannot be add");
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
          }, 1500);
          return;
        }
      });
    } else {
      let response = await createAnonymousComment(obj).then((response) => {
        if (response.status === 200) {
          flag = true;
        } else {
          setMessage("Comment cannot be add");
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
          }, 1500);
          return;
        }
      });
    }
    if (flag) {
      props.mainStore.setCommentModal(false);
      if(props.mainStore.getLogStatus)
        history.push("/user");
      
    }
  };
  return (
    <Modal
      dimmer="inverted"
      open={props.mainStore.commentModal}
      onClose={() => props.mainStore.setCommentModal(false)}
    >
      <Response open={open} message={message} />
      <Modal.Header>Comment add</Modal.Header>
      <Modal.Content>
        <Form onSubmit={(e) => submitHandle(e)}>
          <Form.Field
            required
            onChange={(e) => setCommentContent(e.target.value)}
          >
            <label>Comment content</label>
            <TextArea style={{ minHeight: 300, resize: "none" }} />
          </Form.Field>
          <Button type="submit">Add comment</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
}))(observer(CommentModal));
