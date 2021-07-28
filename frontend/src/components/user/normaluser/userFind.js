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
import { useHistory } from "react-router-dom";
import { inject, observer } from "mobx-react";
import cssobject from "./css/User";
import {findUser} from "../../../utils/user.util"
import {findPostsByTagName} from "../../../utils/post.util"

function UserFind(props) {
  const [loading, setLoading] = useState("false");
  const [users, setUsers] = useState([]);
  const [posts,setPosts] = useState([]);
  const history = useHistory();
  
  const fetchDatiWhichWeWillFind = async ()=>{
    try {
      const { user } = props.match.params;
      const userWhichWeFind = await findUser(user);
      const postWithTagWichFind = await findPostsByTagName(user);
      setUsers(userWhichWeFind);
      setPosts(postWithTagWichFind)
      setLoading("true");
    } catch (err) {
      setLoading("error");
    }
  }

  useEffect(() => {
    fetchDatiWhichWeWillFind();
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
              style={cssobject.userfindlistitem}
            >
              <List.Icon name="user" size="large" verticalAlign="middle" />
              <List.Content
                style={cssobject.userfindlistcontent}
              >
                <List.Header as="h4">{user.username}</List.Header>
                <Button icon="user" onClick={()=>history.push(`/userprofile/${user._id}`)} />
              </List.Content>
            </List.Item>
          ))}
        </List>
      ) : (
        <Header
          style={cssobject.userfindheader}
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
              <Card style={cssobject.userfindcard}>
              <Card.Content>
                <Card.Header>
                  <div>{post.title}</div>
                  <Card.Meta style={cssobject.userfindcardmeta}>
                    Create: {post.createDate.split("T")[0]}
                  </Card.Meta>
                  <br />
                </Card.Header>
                <Card.Description style={cssobject.userfindcarddesc}>
                  {post.content}
                </Card.Description>
                Tags: <br />
                {post.tags.map((tag) => (
                  <Label>{tag}</Label>
                ))}
              </Card.Content>
              <Card.Content style={cssobject.userfindcardcontent} extra>
                <a
                  style={cssobject.userfindcardcontenta}
                >
                  <Icon name="comment" />
                  {post.comments.length}
                </a>
                {post.likes.includes(props.userStore.getLogedUser._id) ? (
                  <a
                  >
                    <Icon style={cssobject.userfindicon} name="like" />
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
                  style={cssobject.userfindbutton}
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
            style={cssobject.userfindheader}
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