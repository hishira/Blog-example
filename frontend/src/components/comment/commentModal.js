import React, { useState } from "react";
import { Button, Modal, Form, TextArea } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import Response from "../shared/response";
import { createComment, createAnonymousComment } from "../../api/commentApi";
import { useHistory } from "react-router-dom";
import { createCommentHandle } from "../../utils/comment.util";

function CommentModal(props) {
  const [commentContent, setCommentContent] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();

  const messegaFunction = (message) => {
    setMessage("Comment cannot be empty");
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    const ifAllOk = await createCommentHandle(
      props.post._id,
      commentContent,
      props.mainStore.getLogStatus,
      messegaFunction
    );
    if (ifAllOk) {
      props.mainStore.setCommentModal(false);
      if (props.mainStore.getLogStatus) history.push("/user");
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
