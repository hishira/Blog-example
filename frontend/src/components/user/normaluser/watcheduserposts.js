import React, { useState, useEffect } from "react";
import LoadingComponent from "../../shared/loadingComponent";
import { getPostsWatchedUser } from "../../../api/postApi";
import { inject, observer } from "mobx-react";
import { Icon } from "semantic-ui-react";
import PostComments from '../../comment/commentsForPost';
import "./css/watcheduserposts.css";
function WatchedUserPosts(props) {
  const [loading, setLoading] = useState("false");
  const [posts, setPosts] = useState([]);
  const [commentsPostId,setCommentsPostID] = useState("")

  const commentsForPostOpenHandle = (postid)=>{
    setCommentsPostID(postid);
    props.mainStore.setCommentsForPost(true);
  }
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
        <div>
          {posts.map((userpost) => (
            <div key={userpost._id} className="owncard">
              <div className="owncard-title">
                {userpost.title}
                <div className="owncard-createdate">
                  {userpost.createDate.split("T")[0]}
                </div>
                <div className="owncard-username">
                  {userpost.user.username}
                </div>
              </div>
              <div className="owncard-content">{userpost.content}</div>
              <div className="owncard-meta">
                <a
                  onClick={
                    () => commentsForPostOpenHandle(userpost._id)
                  }
                >
                  <Icon name="comment" />
                  {userpost.comments.length}
                </a>
                {userpost.likes.includes(props.userStore.getLogedUser._id) ? (
                  <a
                    onClick={
                      () => {}
                      /*props.unlikePostHandle(props.post, props.userStore.getLogedUser)*/
                    }
                  >
                    <Icon name="like" style={{color:"red"}} />
                    {userpost.likes.length}
                  </a>
                ) : (
                  <a
                    onClick={
                      () => {}
                      /* props.likePostHandle(props.post, props.userStore.getLogedUser)*/
                    }
                  >
                    <Icon name="like" />
                    {userpost.likes.length}
                  </a>
                )}
              </div>
            </div>
          ))}
            <PostComments postid={commentsPostId} />
        </div>

      )}
    </div>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
  userStore: stores.userStore,
}))(observer(WatchedUserPosts));
