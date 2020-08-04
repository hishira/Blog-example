import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Response from "../shared/response";
import {register} from '../../api/authApi'
import { Button, Form, Grid, Message, Segment } from "semantic-ui-react";

export default function SignUp(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [message,setMessage] = useState("")
  const history = useHistory();

  const signUp = async () => {
    console.log(email);
    console.log(password);
    if (email === "" || password === ""){
      setMessage("Please fill fields below")
      setOpen(true)
      setTimeout(() => {
        setOpen(false)
      }, 1500);
      return
    }
    let obj = { email: email, password: password };
    await register(obj).then(request=>{
      console.log(request)
      if(request.status === 200){
        return request.json()
      }else if(request.status === 400){
        setMessage("User with that email exists")
        setOpen(true)
        setTimeout(() => {
        setOpen(false)
      }, 1500);
      }
      else
        throw "Error with"
    }).then(data=>{
      console.log(data)
      history.push('/login')
    }).catch(err=>{
      console.log(err)
      setMessage("Wrong with server")
      setOpen(true)
      setTimeout(() => {
        setOpen(false)
      }, 1500);
    })
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
