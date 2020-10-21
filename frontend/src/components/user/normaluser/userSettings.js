import React from "react";
import { Container, Card,Button } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import cssobject from './css/UserSettings'
export default function UserSettings(props) {
    const history = useHistory();
  return <Container >
      <Button onClick={() => history.push("/user")} style={cssobject.buttonuser}icon='arrow left'/>
      <Card onClick={() => history.push("/emailchange")} style={cssobject.buttonemailchange} link header="Email change" meta="Scientist" />
      <Card onClick={() => history.push("/passwordchange")} style={cssobject.butttonpasswordchange} link header="Passord change" meta="Scientist" />
      <Card onClick={() => history.push("/descriptionchange")} style={cssobject.buttondescriptionchange} link header="Description change" meta="Scientist" />
    </Container>
  
}
