import React, { useState } from "react";
import { Button, Modal, Form, TextArea, Input } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import Response from "../shared/response";
import { useHistory } from "react-router-dom";
import { EditPostHandle } from "../../utils/post.util";
function EditPostModal(props) {
  const [postTitle, setPostTitle] = useState(props.post.title);
  const [postContent, setPostContent] = useState(props.post.content);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();

  const setMessageOpenModal = (message) => {
    setMessage(message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  const goodRequetEndFunction = () => {
    props.mainStore.setEditPostModal(false);
    if (props.mainStore.getLogStatus) history.push("/user");
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    await EditPostHandle(
      props.post._id,
      postTitle,
      postContent,
      goodRequetEndFunction,
      setMessageOpenModal
    );
  };
  return (
    <Modal
      dimmer="inverted"
      open={props.mainStore.editPostModal}
      onClose={() => props.mainStore.setEditPostModal(false)}
    >
      <Response open={open} message={message} />
      <Modal.Header>Edit Post</Modal.Header>
      <Modal.Content>
        <Form onSubmit={(e) => submitHandle(e)}>
          <Form.Field onChange={(e) => setPostTitle(e.target.value)}>
            <label>Post title</label>
            <Input placeholder={props.post.title} />
          </Form.Field>
          <Form.Field required onChange={(e) => setPostContent(e.target.value)}>
            <label>Post content</label>
            <TextArea
              style={{ minHeight: 300, resize: "none" }}
              placeholder={props.post.content}
            />
          </Form.Field>

          <Button type="submit">Edit post</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
}))(observer(EditPostModal));
