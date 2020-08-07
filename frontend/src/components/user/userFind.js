import React, { useEffect, useState } from "react";
import { Container, Segment, Dimmer, Loader } from "semantic-ui-react";
import { userFind } from "../../api/userApi";

export default function UserFind(props) {
  const [loading, setLoading] = useState("false");
  const [users, setUsers] = useState([]);
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
        console.log(response)
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
      ) : (
        <Container>OK</Container>
      )}
    </Container>
  );
}
