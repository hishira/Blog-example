import React, { useEffect, useState } from "react";
import {
  Container,
  Segment,
  Dimmer,
  Loader,
  Header,
  List,
  Button,
  Divider,
  Card,
  Label,
  Icon
} from "semantic-ui-react";
import { userFind } from "../../api/userApi";
import { useHistory } from "react-router-dom";
import {getPostsByTag} from '../../api/postApi'
import { inject, observer } from "mobx-react";

function UserFind(props) {
  const [loading, setLoading] = useState("false");
  const [users, setUsers] = useState([]);
  const [posts,setPosts] = useState([]);
  const history = useHistory();
  useEffect(() => {
    let fetchData = async () => {
      try {
        const { user } = props.match.params;
        let response = await userFind({ username: user }).then((response) => {
          if (response.status === 200) return response.json();
          return null;
        });
        if (response === null) throw new Error("err");
        let responseOneMore = await getPostsByTag({username:user}).then(response=>{
          if (response.status === 200) return response.json();
          return null
        })
        if(responseOneMore === null) throw new Error("err");
        setUsers(response);
        setPosts(responseOneMore)
        console.log(response);
        console.log(responseOneMore);
        setLoading("true");
      } catch (err) {
        setLoading("error");
      }
    };
    fetchData();
  }, [props]);
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
      ) : users.length > 0 ? (
        <List divided>
          {users.map((user) => (
            <List.Item
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "1rem",
                alignItems: "center",
              }}
            >
              <List.Icon name="user" size="large" verticalAlign="middle" />
              <List.Content
                style={{
                  display: "flex",
                  width: "25rem",
                  justifyContent: "space-between",
                  alignItems:"center",
                  marginLeft: "2rem",
                }}
              >
                <List.Header as="h4">{user.username}</List.Header>
                <Button icon="user" onClick={()=>history.push(`/userprofile/${user._id}`)} />
              </List.Content>
            </List.Item>
          ))}
        </List>
      ) : (
        <Header
          style={{
            position: "relative",
            left: "50%",
            marginTop: "3rem",
            transform: "translate(-15%,-50%)",
          }}
          as="h2"
          icon="exclamation"
          content="Not user found"
        />
      )}
      <Divider horizontal>Or</Divider>
      { loading === "false" ? (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
          </Segment>
        ) : loading === "error" ? (
          <div>Error</div>
        ) : posts.length > 0 ? (
          <Container>
            {
              posts.map((post) => 
              <Card style={{ marginRight: "auto", marginLeft: "auto", width: "80%" }}>
              <Card.Content>
                <Card.Header>
                  <div>{post.title}</div>
                  <Card.Meta style={{ marginTop: ".5rem" }}>
                    Create: {post.createDate.split("T")[0]}
                  </Card.Meta>
                  <br />
                </Card.Header>
                <Card.Description style={{ marginTop: "2rem" }}>
                  {post.content}
                </Card.Description>
                Tags: <br />
                {post.tags.map((tag) => (
                  <Label>{tag}</Label>
                ))}
              </Card.Content>
              <Card.Content style={{ padding: ".5rem" }} extra>
                <a
                  style={{ marginRight: ".5rem" }}
                  
                >
                  <Icon name="comment" />
                  {post.comments.length}
                </a>
                {post.likes.includes(props.userStore.getLogedUser._id) ? (
                  <a
                  >
                    <Icon style={{ color: "red" }} name="like" />
                    {post.likes.length}
                  </a>
                ) : (
                  <a
                    
                  >
                    <Icon name="like" />
                    {post.likes.length}
                  </a>
                )}
                <Button
                  style={{ marginLeft: "1.5rem" }}
                  basic
                  color="blue"
                 
                >
                  Add comment
                </Button>
              </Card.Content>
            </Card>
            )
                }
          </Container>
          ):(
          <Header
            style={{
              position: "relative",
              left: "50%",
              marginTop: "3rem",
              transform: "translate(-15%,-50%)",
            }}
            as="h2"
            icon="exclamation"
            content="Not post with that tag found"
          />
        )
      }
    </Container>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
  userStore: stores.userStore,
}))(observer(UserFind));