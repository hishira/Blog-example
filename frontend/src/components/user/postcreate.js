import React, { useState } from "react";
import {
  Container,
  Header,
  Divider,
  Form,
  Input,
  TextArea,
  Button,
} from "semantic-ui-react";
import {createPost} from '../../api/postApi'
import {useHistory} from 'react-router-dom'

export default function CreatePost(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const history = useHistory()

  const createPostHandle = async(e)=>{
    console.log(title,content)
    let obj = {
        title:title,
        content:content
    }
    let flag = false
    await createPost(obj).then(response=>{
        if(response.status === 200)
            flag = true
    })
    if (flag === true)
        history.push('/')
  }
  return (
    <Container>
      <Header
        textAlign="center"
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
        as="h1"
      >
        <Header.Content>Post create</Header.Content>
      </Header>
      <Divider />
      <Form size="large">
        <Form.Group widths="equal">
          <Form.Field 
          id='title' 
          onChange={(e)=>setTitle(e.target.value)}
          control={Input} 
          label="Post title" 
          placeholder="Title" />
        </Form.Group>
        <Form.Field
          control={TextArea}
          onChange={(e)=>setContent(e.target.value)}
          label="Post content"
          placeholder="Write something"
          id='content'
          style={{ minHeight: 300, resize: "none" }}
        />
        <Button color='facebook' type='submit' onClick={(e)=>createPostHandle(e)}>Create Post</Button>
      </Form>
    </Container>
  );
}
