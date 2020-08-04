import React, { useState } from "react";
import {emailChange} from '../../api/userApi'
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
import Response from '../shared/response'
export default function EmailChange(props) {
  const [email, setEmail] = useState("");
  const [open,setOpen] = useState(false)
  const [message,setMessage] = useState("")
  const history = useHistory();
  const submitHandle = async(e)=>{
        e.preventDefault();
        console.log(email);
        let response = await emailChange({email:email}).then(res=>{
            console.log(res.status)
            if(res.status === 200)
                history.push('/user')
            else{
                setMessage("Problem with email chainging")
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
        <Header.Content>Email change</Header.Content>
      </Header>
      <Divider />
      <Form size="large">
        <Input iconPosition="left" onChange={(e)=>setEmail(e.target.value)} placeholder="New email">
          <Icon name="at" />
          <input />
        </Input>
        <br/>
        <Button style={{marginTop:"2rem"}} onClick={(e)=>submitHandle(e)}>Change email</Button>
      </Form>
    </Container>
  );
}
