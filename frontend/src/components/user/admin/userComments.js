import React, { useState, useEffect } from "react";
import { Container } from "semantic-ui-react";
import { getUserComments } from "../../../api/adminApi";
import Loading from '../../shared/loadingComponent'

export default function UserComments(props) {
  const [comments, setComments] = useState([]);
  const [loading,setLoading] = useState("false");
  useEffect(() => {
    const fetchData = async () => {
      let id = props.match.params.id;
      console.log(id);
    };
    fetchData();
  }, []);
  return <Container>
      {
          loading === "false"?(
            <Loading/>
            ): loading === "error"?(<div>Error</div>):(
              <div>
                  {JSON.stringify(comments)}
              </div>
          )
      }
  </Container>;
}
