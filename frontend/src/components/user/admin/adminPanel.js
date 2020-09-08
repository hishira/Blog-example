import React from 'react';
import {Container,Button,Icon,Header} from 'semantic-ui-react'
import {useHistory} from 'react-router-dom'
export default function AdminPanel(props){
    const styles = {
        mainContainer: {
            marginTop:"2rem",
            border:"1px solid #e6e6e6",
            borderRadius:"15px",
            padding:".4rem",
            backgroundColor:"whitesmoke"
        },
        buttonGroup:{
            display:"flex",
            justifyContent:"space-between",
            justifyItems:"space-between",
            padding:".5rem"
        }
    }
    const history = useHistory();
    return(
    <Container  style={styles.mainContainer}>
        <Header as="h3">
        Admin panel
        </Header>
        <Button.Group style={styles.buttonGroup}>
            <Button onClick={()=>history.push('/useredits')} color="teal">
                <Icon name="user"/>
                Users edit
            </Button>
            <Button color="teal">
                <Icon name="wordpress forms"/>
                Posts edit
            </Button>
            <Button color="teal">
                <Icon name="comment"/>
                Comments edit
            </Button>    
        </Button.Group>
    </Container>)
}