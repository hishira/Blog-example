import React, { useState, useEffect } from "react";
import { Container, Comment, Button } from "semantic-ui-react";
import { getUserComments } from "../../../api/adminApi";
import Loading from "../../shared/loadingComponent";
import {userCommentDelete} from '../../../api/adminApi'
import { useHistory } from "react-router-dom";

export default function UserComments(props) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState("false");
  const [dataChange,setDataChange] = useState(false)
  const history = useHistory();
  const deleteCommentHandle = async (commentId) => {
    console.log(commentId);
    let obj = {userID:props.match.params.id}
    let data = await userCommentDelete(commentId,obj).then(response=>{
        if(response.status === 200)
            return true
        return false
    })
    if(data){
        setDataChange(!dataChange)
        history.push(`/userallcomment/${obj.userID}`)
        return
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      let id = props.match.params.id;
      console.log(id);
      try {
        let data = await getUserComments(id).then((response) => {
          if (response.status === 200) return response.json();
          return null;
        });
        if (data === null) throw new Error("error");
        setComments(data);
        setLoading("true");
      } catch (err) {
        setLoading("error");
      }
    };
    fetchData();
  },[dataChange]);
  return (
    <Container>
      {loading === "false" ? (
        <Loading />
      ) : loading === "error" ? (
        <div>Error</div>
      ) : (
        <Comment.Group
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
                  <Button color="teal" size="tiny" onClick={()=>deleteCommentHandle(comment._id)} style={{ margin: ".5rem" }}>
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
