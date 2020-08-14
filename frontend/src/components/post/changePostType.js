import React, { useState } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import {makePostPublic,makePostPrivate} from '../../api/postApi'
import { useHistory } from "react-router-dom";

function ChangePostType(props) {
    const history = useHistory();
  const changepostTypeHandle = async () => {
    if (props.typeToChange === "private") {
        let res = await makePostPrivate(props.id).then(response=>{
            if(response.status === 200)
                return true
            else return false
        })
        if(res === true){
            console.log("yse")
            props.mainStore.setEditTypePostModal(false)
            history.push('/user')
        }
    }else{
        let res = await makePostPublic(props.id).then(response=>{
            if(response.status === 200)
                return true
            else return false
        })
        if(res === true){
            props.mainStore.setEditTypePostModal(false)
            history.push('/user')
        }
    }

  };
  return (
    <Modal
      closeIcon
      open={ props.mainStore.editTypePostModal}
    
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
