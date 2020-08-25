import React, { useState } from "react";
import { Modal, Button, Form, Segment, Message } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import Cookies from "js-cookie";
import { login } from "../../api/authApi";
import { useHistory } from "react-router-dom";
import Response from "../shared/response";

function LoginModal(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();

  const loginhandle = async () => {
    console.log(email);
    console.log(password);
    if (email === "" || password === "") {
      setMessage("Please fill fields below");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 1500);
      return;
    }
    let obj = { email: email, password: password };
    await login(obj)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((dane) => {
        Cookies.set("user", dane.user);
        console.log(dane.user);
        props.mainStore.setLogged(true);
        props.mainStore.setLoginModal(false)
        history.push("/user");
      })
      .catch((err) => {
        setMessage("Wrong email or password");
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 1500);
      });

  };
  const onCloseHandle = ()=>{
    props.mainStore.setLoginModal(false)
    setEmail("")
    setPassword("")
  }
  return (
    <Modal
      open={props.mainStore.loginModal}
      onClose={() => onCloseHandle()}
      onOpen={() => props.mainStore.setLoginModal(true)}
      dimmer="blurring"
    >
      <Response open={open} message={message} />
      <Modal.Header style={{textAlign: 'center'}}>Login</Modal.Header>
      <Modal.Content>
        <Form size="tiny">
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              color="teal"
              fluid
              size="large"
              type
              onClick={() => loginhandle()}
            >
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
        New to us?{" "}
        <span
          style={{
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline",
          }}
          onClick={() => history.push("/signup")}
        >
          Sign Up
        </span>
      </Message>
      </Modal.Content>
      
    </Modal>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
}))(observer(LoginModal));
