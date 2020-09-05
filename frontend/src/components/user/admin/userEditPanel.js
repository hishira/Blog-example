import React, { useState, useEffect } from "react";
import {
  Container,
  Segment,
  Dimmer,
  Loader,
  List,
  Icon,
  Button,
} from "semantic-ui-react";
import { getAllUsers } from "../../../api/adminApi";
export default function UserEditPanel(props) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState("false");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllUsers().then((response) => {
          if (response.status === 200) return response.json();
          else return null;
        });
        if (data === null) throw new Error("Err");
        setUsers(data);
        setLoading("true");
        console.log(data);
      } catch (e) {
        setLoading("error");
      }
    };
    fetchData();
  }, []);
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
        <List >
          {users.map((user) => (
            <List.Item style={{padding:".5rem"}}>
              <List.Content>
                  Email:{user.email}
                  <br/>
                  <br/>
                  Role: {user.role}
                  </List.Content>
                <Button.Group style={{margin:"1rem 0 1rem 0"}}>
                    <Button color="teal">Edit user</Button>
                    <Button color="teal">Post</Button>
                    <Button color="teal">Commetns</Button>
                </Button.Group>
            </List.Item>
          ))}
        </List>
      )}
    </Container>
  );
}
