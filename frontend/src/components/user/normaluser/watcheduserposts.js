import React, { useState, useEffect } from "react";
import LoadingComponent from "../../shared/loadingComponent";
import { getPostsWatchedUser } from "../../../api/postApi";
import { inject, observer } from "mobx-react";
import { Icon } from "semantic-ui-react";
import PostComments from '../../comment/commentsForPost';
import "./css/watcheduserposts.css";
import {likePost,removeLikePost} from '../../../api/postApi'
import { useHistory } from "react-router-dom";

function WatchedUserPosts(props) {
  const [loading, setLoading] = useState("false");
  const [posts, setPosts] = useState([]);
  const [commentsPostId,setCommentsPostID] = useState("")
  const [reload,setReload] = useState(false)
  const commentsForPostOpenHandle = (postid)=>{
    setCommentsPostID(postid);
    props.mainStore.setCommentsForPost(true);
  }
  const likeposthandle = async (post)=>{
    let obj = {userID:props.userStore.getLogedUser._id};
    console.log(obj);
    let res = await likePost(post._id,obj).then(response=>{
      if(response.status === 200) return true;
      else return false
    })
    if(res){
      let newposts = posts;
      for(let i in newposts){
        if(newposts[i]._id === post._id){
          newposts[i].likes.push(props.userStore.getLogedUser._id);
        }
      }
      setReload(!reload);
    }
  }
  const unlikePostHandle = async (post) => {
    let obj = {userID: props.userStore.getLogedUser._id};
    let res = await removeLikePost(post._id,obj).then(response=>{
      if(response.status === 200) return true
      return false
    })
    if(res){
      let user = props.userStore.getLogedUser;
      let newPosts = posts;
      for(let i in newPosts){
        if(newPosts[i]._id === post._id){
          let index = newPosts[i].likes.indexOf(user._id);
          if(index > -1) newPosts[i].likes.splice(index,1);
        }
      }
      setReload(!reload);
    }
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
  }, reload);
  const history = useHistory();
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
          {posts.length > 0?
           (<div>{posts.map((userpost) => (
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
                      () => unlikePostHandle(userpost)
                    }
                  >
                    <Icon name="like" style={{color:"red"}} />
                    {userpost.likes.length}
                  </a>
                ) : (
                  <a
                    onClick={
                      () => likeposthandle(userpost,props.userStore.getLogedUser)
                    }
                  >
                    <Icon name="like" />
                    {userpost.likes.length}
                  </a>
                )}
              </div>
            </div>))
            }
            </div>):(
              <div>
            <div className='noposttitle' >Not new posts</div>
            <div className='createpoststitle' onClick={()=>history.push("/postcreate")}>
              Create post
            </div>
            </div>)
            }
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
