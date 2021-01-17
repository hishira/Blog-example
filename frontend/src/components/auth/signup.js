import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Response from "../shared/response";
import {register} from '../../api/authApi'
import { Button, Form, Grid, Message, Segment } from "semantic-ui-react";
import {signUpUserFunction} from "../../utils/auth.util"
export default function SignUp(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username,setUsername] = useState("")
  const [open, setOpen] = useState(false);
  const [message,setMessage] = useState("")
  const history = useHistory();

  const messageOpen = (messageString)=>{
    setMessage(messageString)
      setOpen(true)
      setTimeout(() => {
        setOpen(false)
      }, 1500);
  }
  
  const signUp = async () => {
    const response = await signUpUserFunction(email,password,username)
    if(typeof response === "string"){
      messageOpen(response);
    }else{
      history.push('/login')
    }
  };
  
  return (
    <div>
      <Response open={open} message={message} />
      <Grid
        textAlign="center"
        style={{ marginTop: "8rem" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Form size="large">
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
                icon="male"
                iconPosition="left"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
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
                onClick={() => signUp()}
              >
                Sign Up
              </Button>
            </Segment>
          </Form>
          <Message>
            Have account?{" "}
            <span
              style={{ cursor: "pointer", color:"blue",textDecoration:"underline" }}
              onClick={() => history.push("/login")}
            >
              Login
            </span>
          </Message>
        </Grid.Column>
      </Grid>
    </div>
  );
}
