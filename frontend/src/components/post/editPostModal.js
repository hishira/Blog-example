import React, { useState } from "react";
import { Button, Modal, Form, TextArea, Input } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import Response from "../shared/response";
import { editPost } from "../../api/postApi";
import { useHistory } from "react-router-dom";
function EditPostModal(props) {
  const [postTitle, setPostTitle] = useState(props.post.title);
  const [postContent, setPostContent] = useState(props.post.content);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();
  const submitHandle = async (e) => {
    e.preventDefault();
    console.log(props.post._id);
    if (postContent === "" || postTitle === "") {
      setMessage("Post title or post content cannot be empty");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 1500);
      return;
    }
    let obj = {
      title: postTitle,
      content: postContent,
    };
    let flag = false;
    console.log(obj);
    let response = await editPost(props.post._id, obj).then((response) => {
      if (response.status === 200) {
        flag = true;
      } else {
        setMessage("Post cannot be edited");
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 1500);
        return;
      }
    });
    if (flag) {
      props.mainStore.setEditPostModal(false);
      if (props.mainStore.getLogStatus) history.push("/user");
    }
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
