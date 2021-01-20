import React, { useState, useEffect } from "react";
import { Modal, Button, Form, TextArea } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import Response from "../../shared/response";
import { addUserDescription } from "../../../api/userApi";
import { useHistory } from "react-router-dom";
import cssobject from './css/Usermodal'
import {changeUserDescription} from "../../../utils/user.util"
function DescriptionModal(props) {
  const [description, setDescription] = useState("");
  const [response, setResponse] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();

  const messageFunction = (message)=>{
    setMessage(message);
    setResponse(true);
    setTimeout(() => {
      setResponse(false);
      setMessage("");
    }, 1500);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const responseStatus = await changeUserDescription(description,messageFunction);
    if(responseStatus){
      history.push("/user");
      props.mainStore.setModal(false)
    }
  };
  
  return (
    <Modal
      open={props.mainStore.descriptiopnModal}
      onClose={() => props.mainStore.setModal(false)}
      size="small"
    >
      <Response open={response} message={message} />
      <Modal.Header>Description add</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Description</label>
            <TextArea
              onChange={(e) => setDescription(e.target.value)}
              style={cssobject.modalTextArea}
            />
          </Form.Field>
        </Form>
        <Button onClick={(e) => handleSubmit(e)}> Add description</Button>
      </Modal.Content>
    </Modal>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
}))(observer(DescriptionModal));
