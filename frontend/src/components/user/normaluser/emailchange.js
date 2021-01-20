import React, { useState } from "react";
import { emailChange } from "../../../api/userApi";
import {
  Container,
  Header,
  Divider,
  Form,
  Input,
  Icon,
  Button,
} from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import Response from "../../shared/response";
import cssobject from "./css/UserSettings";
import {changeEmail} from "../../../utils/user.util";
export default function EmailChange(props) {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();

  const messageFunction = (message)=>{
    setMessage(message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
      setMessage("");
    }, 1500);
  }

  const submitHandle = async (e) => {
    e.preventDefault();
    const responseStatus = await changeEmail(email,messageFunction)
    if(responseStatus)
      history.push("/user")  
  };

  return (
    <Container>
      <Response open={open} message={message} />
      <Header textAlign="center" style={cssobject.changeheader} as="h1">
        <Header.Content>Email change</Header.Content>
      </Header>
      <Divider />
      <Form size="large">
        <Input
          iconPosition="left"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="New email"
        >
          <Icon name="at" />
          <input />
        </Input>
        <br />
        <Button
          style={cssobject.descriptionchangebutton}
          onClick={(e) => submitHandle(e)}
        >
          Change email
        </Button>
      </Form>
    </Container>
  );
}
