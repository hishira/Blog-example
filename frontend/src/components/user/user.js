import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Divider,
  Card,
  Loader,
  Segment,
  Dimmer,
  Icon,
  Container
} from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { getUserInfo } from "../../api/userApi";
import DescriptionModal from "./descriptionModal";
import { inject, observer } from "mobx-react";

function User(props) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState("false");
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const userFromRequest = await getUserInfo().then((request) => {
          if (request.status === 200) return request.json();
          else return null;
        });
        if (userFromRequest === null) throw new Error("Err");
        setUser(userFromRequest);
        setLoading("true");
        console.log(userFromRequest);
      } catch (err) {
        setLoading("error");
      }
    };
    fetchData();
  }, []);
  const history = useHistory();
  return (
    <div style={{ margin: ".5rem",border:"2px solid red" }}>
      <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column width={3}>
            {loading === "false" ? (
              <Segment>
                <Dimmer active inverted >
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              </Segment>
            ) : loading === "error" ? (
              <div>Error</div>
            ) : (
              <Card
                style={{
                  widht: "20rem",
                  marginRight: "auto",
                  marginLeft: "auto",
                }}
              >
                <Card.Content>
                  <Icon name="user" size="large" />
                  <Card.Header
                    style={{ marginTop: "1rem", fontSize: "1.1rem" }}
                  >
                    Email: {user.email}
                  </Card.Header>
                  {user.description !== "" ? (
                    <Card.Description>Opis:{user.description}</Card.Description>
                  ) : (
                    <Button
                      size="tiny"
                      onClick={() => props.mainStore.setModal(true)}
                    >
                      Add description
                    </Button>
                  )}
                </Card.Content>
              </Card>
            )}
          </Grid.Column>
          <Grid.Column width={13}>
            <Button.Group widths="3">
              <Button onClick={() => history.push("/emailchange")} animated>
                <Button.Content visible>Email</Button.Content>
                <Button.Content hidden>Change Email</Button.Content>
              </Button>
              <Button onClick={() => history.push("/postcreate")} animated>
                <Button.Content visible>Post</Button.Content>
                <Button.Content hidden>Create Post</Button.Content>
              </Button>
              <Button onClick={() => history.push("/passwordchange")} animated>
                <Button.Content visible>Password</Button.Content>
                <Button.Content hidden>Password Change</Button.Content>
              </Button>
            </Button.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <DescriptionModal open={modalOpen} />
      {loading === "false" ? (
        <Segment>
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Segment>
      ) : loading === "error" ? (
        <div>Error</div>
      ) : (
        <Container style={{ marginTop:"1rem",border:"2px solid red",marginRight:"auto",marginLeft:"auto"}}>
          {user.posts.map((post) => (
            <Card style={{marginRight:"auto",marginLeft:"auto",width:"100%"}}>
              <Card.Content>
                <Card.Header>{post.title}</Card.Header>
                <Card.Description>
                  {post.content}
                </Card.Description>
              </Card.Content>
              
              <Card.Content extra>
                <a>
                  <Icon name="comment"/>
                  {post.comments.length}
                </a>
              </Card.Content>
            </Card>
          ))}
        </Container>
      )}
    </div>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
}))(observer(User));
