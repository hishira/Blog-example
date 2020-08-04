import React, { useState, useEffect } from "react";
import { Modal, Button, Form, TextArea } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import Response from "../shared/response";
import { addUserDescription } from "../../api/userApi";
import { useHistory } from "react-router-dom";

function DescriptionModal(props) {
  const [description, setDescription] = useState("");
  const [response, setResponse] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(description);
    if (description.length > 250) {
      setMessage("Description must have less than 250 characters");
      setResponse(true);
      setTimeout(() => {
        setResponse(false);
        setMessage("");
      }, 1500);
      return;
    }
    let response = await addUserDescription({ description: description }).then(
      (res) => {
        if (res.status === 200) history.push("/user");
        else {
          setMessage("Problem with description adding");
          setResponse(true);
          setTimeout(() => {
            setResponse(false);
            setMessage("");
          }, 1500);
        }
      }
    );
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
              style={{
                marginTop: ".4rem",
                minHeight: 200,
                resize: "none",
                padding: ".5rem",
              }}
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
