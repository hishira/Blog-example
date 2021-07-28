import React, { useState } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { makePostPrivateHandle, makePostPublicHandle } from "../../utils/post.util";
function ChangePostType(props) {
  const history = useHistory();

  const closePostEditModal = () => {
    props.mainStore.setEditTypePostModal(false);
    history.push("/user");
  };
  const changepostTypeHandle = async () => {
    if (props.typeToChange === "private") {
      await makePostPrivateHandle(props.id, closePostEditModal);
    } else {
      await makePostPublicHandle(props.id, closePostEditModal);
    }
  };
  return (
    <Modal
      closeIcon
      open={props.mainStore.editTypePostModal}
      onClose={() => props.mainStore.setEditTypePostModal(false)}
      onOpen={() => props.mainStore.setEditTypePostModal(true)}
    >
      <Header icon="archive" content="Archive Old Messages" />
      <Modal.Content>
        <p>You are sure to change post to {props.typeToChange}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="red"
          onClick={() => props.mainStore.setEditTypePostModal(false)}
        >
          <Icon name="remove" /> No
        </Button>
        <Button color="green" onClick={() => changepostTypeHandle()}>
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
}))(observer(ChangePostType));
