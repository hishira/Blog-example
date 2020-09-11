import React, { useState, useEffect } from "react";
import { Container, Comment, Button} from "semantic-ui-react";
import Loading from "../../shared/loadingComponent";
import "./admin.css";
import {getAllComments} from '../../../api/adminApi'

export default function Comments(props) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState("false");
  useEffect(()=>{
      const fetchData = async () => {
          try{
        let data = await getAllComments().then(response=>{
            if(response.status === 200)
                return response.json()
            return null
        })
        if(data === null) throw new Error("err")
        setComments(data)
        setLoading("true")
        }catch(err){
            setLoading("error")
        }
      }
      fetchData()
  },[])
  return (
    <Container>
      {loading === "false" ? (
        <Loading />
      ) : loading === "error" ? (
        <div>Error</div>
      ) : (
        <Comment.Group
        className="postEdit"
          style={{
            
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {comments.map((comment) => (
            <Comment key={comment._id}>
              <Comment.Content>
                <Comment.Text>{comment.content}</Comment.Text>
                <Comment.Metadata>
                  Created: {comment.createDate.split("T")[0]}
                  <br />
                  Edited: {comment.editingDate.split("T")[0]}
                  <br />
                  <Button color="teal" size="tiny" /*onClick={()=>deleteCommentHandle(comment._id)}*/ style={{ margin: ".5rem" }}>
                    Delete
                  </Button>
                </Comment.Metadata>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      )}
    </Container>
  );
}
