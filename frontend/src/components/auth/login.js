import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Response from "../shared/response";
import Cookies from 'js-cookie'
import {login} from '../../api/authApi'
import { Button, Form, Grid, Message, Segment } from "semantic-ui-react";
import {inject, observer} from "mobx-react";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [message,setMessage] = useState("")
  const history = useHistory();

  const loginhandle = async () => {
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
    await login(obj).then(response=>{
      if(response.status === 200){
        return response.json()
      }
    }).then(dane=>{
      Cookies.set('user',dane.user)
      console.log(dane.user)
      props.mainStore.setLogged(true)
      props.userStore.setLogedUser(dane.user)
      history.push('/')
    }).catch(err=>{
      setMessage("Wrong email or password")
      setOpen(true)
      setTimeout(() => {
        setOpen(false)
      }, 1500);
    })
  };
  return (
    <div>
      <Response open={open} message={message}/>
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
                onClick={() => loginhandle()}
              >
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            New to us?{" "}
            <span
              style={{ cursor: "pointer",color:"blue",textDecoration:"underline" }}
              onClick={() => history.push("/signup")}
            >
              Sign Up
            </span>
          </Message>
        </Grid.Column>
      </Grid>
    </div>
  );
}
export default inject(stores => ({
  mainStore: stores.mainStore,
  userStore: stores.userStore
}))(observer(Login))