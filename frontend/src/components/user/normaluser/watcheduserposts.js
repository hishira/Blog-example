import React, { useState, useEffect } from "react";
import LoadingComponent from "../../shared/loadingComponent";
import { getPostsWatchedUser } from "../../../api/postApi";
export default function WatchedUserPosts(props) {
  const [loading, setLoading] = useState("false");
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading("true");
        let data = await getPostsWatchedUser({}).then((response) => {
          if (response.status === 200) return response.json();
          return false;
        });
        if (data === false) {
          throw new Error("Error");
        }
        setPosts(data);
        console.log(data);
        setLoading("end");
      } catch (e) {
        setLoading("error");
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      {loading === "false" ? (
        <div />
      ) : loading === "true" ? (
        <LoadingComponent />
      ) : loading === "error" ? (
        <div>Error</div>
      ) : (
        <div />
      )}
    </div>
  );
}
