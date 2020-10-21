import React, { useState } from "react";
import {passwordChange} from '../../../api/userApi'
import {
  Container,
  Header,
  Divider,
  Form,
  Input,
  Icon,
  Button
} from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import Response from '../../shared/response'
export default function EmailChange(props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open,setOpen] = useState(false)
  const [message,setMessage] = useState("")
  const history = useHistory();
  const submitHandle = async(e)=>{
        e.preventDefault();
        console.log(password,confirmPassword);
        if (password !== confirmPassword){
            setMessage("Password do not match with confirm password")
                setOpen(true)
                setTimeout(()=>{
                    setOpen(false)
                    setMessage("")
                }, 1500)
            return
        }
        let response = await passwordChange({password:password}).then(res=>{
            console.log(res.status)
            if(res.status === 200)
                history.push('/user')
            else{
                setMessage("Problem with password change")
                setOpen(true)
                setTimeout(()=>{
                    setOpen(false)
                    setMessage("")
                }, 1500)
            }
        })
  }
  return (
    <Container>
        <Response open={open} message={message}/>
      <Header
        textAlign="center"
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
        as="h1"
      >
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
        <br/>
        <Button style={{marginTop:"2rem"}} onClick={(e)=>submitHandle(e)}>Change password</Button>
      </Form>
    </Container>
  );
}
