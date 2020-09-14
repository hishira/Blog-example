import React from "react";
import { Container, Card,Button } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

export default function UserSettings(props) {
    const history = useHistory();
  return <Container >
      <Button onClick={() => history.push("/user")} style={{position:"absolute",left:20,top:100}}icon='arrow left'/>
      <Card onClick={() => history.push("/emailchange")} style={{display:'inline-block',marginLeft:'.4rem'}} link header="Email change" meta="Scientist" />
      <Card onClick={() => history.push("/passwordchange")} style={{display:'inline-block',marginLeft:'.4rem'}} link header="Passord change" meta="Scientist" />
      <Card onClick={() => history.push("/descriptionchange")} style={{display:'inline-block',marginLeft:'.4rem'}} link header="Description change" meta="Scientist" />
    </Container>
  
}
