import React, { useState, useEffect } from "react";
import { Container, Segment, Dimmer, Loader,Form,Button } from "semantic-ui-react";
import { getUserInfo,editUserInfo } from "../../../api/adminApi";
import { useHistory } from "react-router-dom";

export default function UserInfoEdit(props) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState("false");
  const [email,setEmail] = useState("");
  const [username,setUsername] = useState("") 
  const [description,setDescription] = useState("");
  const [password,setPassword] = useState("")
  const [role,setRole] = useState("")
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const id = props.match.params.id;
      try {
        const data = await getUserInfo(id).then((response) => {
          if (response.status === 200) return response.json();
          return null;
        });
        if (data === null) throw new Error("Err");
        setUser(data);
        setEmail(data.email)
        setUsername(data.username)
        setDescription(data.description)
        setRole(data.role)
        setLoading("true");
      } catch (err) {
        setLoading("error");
      }
    };
    fetchData();
  }, []);
  const submitHandle = async ()=>{
    console.log(email)
    console.log(username)
    console.log(description)
    console.log(password)
    console.log(role)
    const id = props.match.params.id;
    let obj = {
        email:email,
        username:username,
        description:description,
        password:password,
        role:role
    }
    let data = await editUserInfo(id,obj).then(response=>{
        if(response.status === 200)
            return response.json()
        return null
    })
    if (data === null){
        alert("Error with user edit")
        return
    }else{
        history.push('/user')
    }
  }
  return (
    <Container>
      {loading === "false" ? (
        <Segment>
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Segment>
      ) : loading === "error" ? (
        <div>Error</div>
      ) : (
        <Form
            onSubmit={()=>submitHandle()}
        >
            <Form.Input label="Email" onChange={(e)=>setEmail(e.target.value)} placeholder={user.email} />
            <Form.Input label="Username" onChange={(e)=>setUsername(e.target.value)} placeholder={user.username} />
            <Form.Input label="Description" onChange={(e)=>setDescription(e.target.value)} placeholder={user.description} />
            <Form.Input label="Password" onChange={(e)=>setPassword(e.target.value)} placeholder="*****" />
            <Form.Group  grouped>
                <label>User role</label><br/>
                <Form.Field
                    label="USER"
                    control='input'
                    value="USER"
                    type='radio'
                    checked={role === "USER"}
                    onChange={({target})=>setRole(target.value)}
                />
                <Form.Field
                    label="ADMIN"
                    value="ADMIN"
                    onChange={({target})=>setRole(target.value)}
                    control='input'
                    checked={role === "ADMIN"}
                    type='radio'
                />
            </Form.Group>
            <Button type='submit'>
                Edit
            </Button>
        </Form>
      )}
    </Container>
  );
}
