import React, { useState, useEffect } from "react";
import { Container,Comment } from "semantic-ui-react";
import { getUserComments } from "../../../api/adminApi";
import Loading from "../../shared/loadingComponent";

export default function UserComments(props) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState("false");
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
  }, []);
  return (
    <Container>
      {loading === "false" ? (
        <Loading />
      ) : loading === "error" ? (
        <div>Error</div>
      ) : (
        <Comment.Group>
            {comments.map(comment=>
                <Comment>
                    <Comment.Content>
                        <Comment.Text>{comment.content}</Comment.Text>
                        <Comment.Metadata>
                            Created: {comment.createDate.split("T")[0]}
                            <br/>
                            Edited: {comment.editingDate.split("T")[0]}
                            
                        </Comment.Metadata>
                    </Comment.Content>
                </Comment>
            )}
        </Comment.Group>
      )}
    </Container>
  );
}
