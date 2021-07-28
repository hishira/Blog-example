import React, { useState } from "react";
import { Container, Header, Divider, Form, Button } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import Response from "../../shared/response";
import cssobject from "./css/UserSettings";
import { changePassword } from "../../../utils/user.util";

export default function EmailChange(props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();

  const messageFunction = (message) => {
    setMessage(message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
      setMessage("");
    }, 1500);
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    console.log(password, confirmPassword);
    const responseStatus = await changePassword(
      password,
      confirmPassword,
      messageFunction
    );
    if (responseStatus) {
      history.push("/user");
    }
  };

  return (
    <Container>
      <Response open={open} message={message} />
      <Header textAlign="center" style={cssobject.changeheader} as="h1">
        <Header.Content>Password change</Header.Content>
      </Header>
      <Divider />
      <Form size="large">
        <Form.Field onChange={(e) => setPassword(e.target.value)}>
          <label>Enter new password: </label>
          <input type="password" />
        </Form.Field>
        <Form.Field onChange={(e) => setConfirmPassword(e.target.value)}>
          <label>Confirm new password: </label>
          <input type="password" />
        </Form.Field>
        <br />
        <Button
          style={cssobject.descriptionchangebutton}
          onClick={(e) => submitHandle(e)}
        >
          Change password
        </Button>
      </Form>
    </Container>
  );
}
