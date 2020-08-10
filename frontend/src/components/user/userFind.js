import React, { useEffect, useState } from "react";
import {
  Container,
  Segment,
  Dimmer,
  Loader,
  Header,
  List,
  Button,
} from "semantic-ui-react";
import { userFind } from "../../api/userApi";
import { useHistory } from "react-router-dom";

export default function UserFind(props) {
  const [loading, setLoading] = useState("false");
  const [users, setUsers] = useState([]);
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
        setUsers(response);
        console.log(response);
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
            position: "absolute",
            left: "50%",
            marginTop: "3rem",
            marginRight: "-50%",
            transform: "translate(-50%,-50%)",
          }}
          as="h2"
          icon="exclamation"
          textAlign="center"
          content="Not user found"
        />
      )}
    </Container>
  );
}
