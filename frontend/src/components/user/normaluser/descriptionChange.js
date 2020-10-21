import React, { useState } from "react";
import { Container, Form, TextArea, Button } from "semantic-ui-react";
import {addUserDescription} from '../../../api/userApi'
import { useHistory } from "react-router-dom";
import Response from "../../shared/response";
import cssobject from './css/UserSettings'

export default function DescriptionChange(props) {
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [message,setMessage] = useState("")
  const history = useHistory();

  const descriptionChangeHandle = async () => {
    console.log(description);
    let obj = {description:description}
    let res = await addUserDescription(obj).then(response =>{
        if(response.status === 200)
            return true;
        return false
    })
    if(res){
        history.push("/user")
    }else{
        setMessage("Something goes wrong with description change")
      setOpen(true)
      setTimeout(() => {
        setOpen(false)
      }, 1500);
      return
    }
};
  return (
    <Container>
        <Response open={open} message={message}/>
      <Form>
        <label style={cssobject.descriptionchangelabel}>User description</label>
        <TextArea
          onChange={(e) => setDescription(e.target.value)}
          style={cssobject.descriptionchangetextarea}
        />
      </Form>
      <Button
        style={cssobject.descriptionchangebutton}
        onClick={() => descriptionChangeHandle()}
      >
        Change Description
      </Button>
    </Container>
  );
}
