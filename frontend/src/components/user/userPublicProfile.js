import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Card,
  Loader,
  Segment,
  Dimmer,
  Grid,
  Icon
} from "semantic-ui-react";
import { getPublicUserInfo } from "../../api/userApi";
export default function PublicUserProfile(props) {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState("false");
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await getPublicUserInfo(props.match.params.id).then(
          (response) => {
            if (response.status === 200) return response.json();
            return null;
          }
        );
        if (data === null) throw new Error("Problem");
        setUserInfo(data);
        setLoading("true");
        console.log(data);
      } catch (err) {
        setLoading("error");
        return;
      }
    };
    fetchData();
  }, [props.match.params.id]);
  return (
    <div style={{ marginTop: ".5rem" }}>
      {loading === "false" ? (
        <Segment>
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Segment>
      ) : loading === "error" ? (
        <div>Error</div>
      ) : (
        <div>
            <Grid stackable columns={2}>
                <Grid.Column width={3}>
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
                      Username: {userInfo.username}
                      <br/>
                      Email: {userInfo.email}
                    </Card.Header>
                    {userInfo.description !== "" ? (
                      <Card.Description>
                        Opis:{userInfo.description}
                      </Card.Description>
                    ) : (
                      <div></div>
                    )}
                  </Card.Content>
                </Card>
                </Grid.Column>
            </Grid>
        </div>
      )}
    </div>
  );
}
