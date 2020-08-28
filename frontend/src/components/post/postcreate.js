import React, { useState } from "react";
import {
  Container,
  Header,
  Divider,
  Form,
  Input,
  TextArea,
  Button,
  Checkbox,
  Icon,
} from "semantic-ui-react";
import { createPost } from "../../api/postApi";
import { useHistory } from "react-router-dom";

export default function CreatePost(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [makePostPrivate, setMakePostPrivate] = useState(false);
  const [tag,setTag] = useState("")
  const [tags,setTags] = useState([])
  const history = useHistory();
  const setTagsHandle = ()=>{
    if(tag === "" || tags.includes(tag))  return
    if (tags.length === 10)
      return
    
    setTags([...tags,tag.split(/(\s+)/).join("")])
    console.log(tags)
    setTag("")
  }
  const createPostHandle = async (e) => {
    console.log(title, content);
    let obj = {
      title: title,
      content: content,
      postPrivate:makePostPrivate,
      tags:tags
    };
    let flag = false;
    await createPost(obj).then(response=>{
        if(response.status === 200)
            flag = true
    })
    if (flag === true)
        history.push('/')

  };
  return (
    <Container>
      <Header
        textAlign="center"
        style={{
          marginTop: "2rem",
          marginBottom: "2rem",
          position: "relative",
        }}
        as="h1"
      >
        <Header.Content>Post create</Header.Content>
        <Checkbox
          label="Make post private"
          style={{ position: "absolute", right: "0" }}
          onChange={(e,data)=>setMakePostPrivate(data.checked)}
        />
      </Header>
      <Divider />
      <Form size="large">
        <Form.Group widths="equal">
          <Form.Field
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            control={Input}
            label="Post title"
            placeholder="Title"
          />
        </Form.Group>
        <Form.Field
          control={TextArea}
          onChange={(e) => setContent(e.target.value)}
          label="Post content"
          placeholder="Write something"
          id="content"
          style={{ minHeight: 300, resize: "none" }}
        />
        <Input>
        <input onChange={(e)=>setTag(e.target.value)}/>
        <Button onClick={()=>setTagsHandle()} size='small'>
          <Icon name='tags'/>
          Add
          </Button>
        </Input>
        <br/>
        <span style={{color:"coral"}}>Max 10 tag</span>
        <br/>
        Tags : {tags.join(", ")}
        <br/>
        <Button
        style={{marginTop:"2rem"}}
          color="facebook"
          type="submit"
          onClick={(e) => createPostHandle(e)}
        >
          Create Post
        </Button>
      </Form>
    </Container>
  );
}
