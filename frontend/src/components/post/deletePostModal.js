import React, { useState } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { deletePost } from "../../api/postApi";
import Response from "../shared/response";
import { useHistory } from "react-router-dom";
import {deletePostHandle} from "../../utils/post.util"
function DeletePostModal(props) {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const setMessageOpen = (message) => {
    setMessage(message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  const endModal = () => {
    props.mainStore.setDeletePostModal(false);
    history.push("/user");
  };
  
  const deletePosthandle = async () => {
    await deletePostHandle(props.id,endModal,setMessageOpen)
  };
  
  return (
    <Modal
      closeIcon
      open={props.mainStore.deletePostModal}
      onClose={() => props.mainStore.setDeletePostModal(false)}
    >
      <Header icon="archive" content="Delete post" />
      <Modal.Content>
        <p>Are you sure to delete this post?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={() => endModal()}>
          <Icon name="remove" /> No
        </Button>
        <Button color="green" onClick={() => deletePosthandle()}>
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
      <Response open={open} message={message} />
    </Modal>
  );
}

export default inject((stores) => ({
  mainStore: stores.mainStore,
}))(observer(DeletePostModal));
