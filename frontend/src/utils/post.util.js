import {
  makePostPublic,
  makePostPrivate,
  deletePost,
  editPost,
  createPost,
  likePost,
  removeLikePost,
  sortPostByLikes,
  sortPost,
  getPostsByTag,
} from "../api/postApi";

const makePostPrivateHandle = async (postid, closemodal) => {
  const response = await makePostPrivate(postid).then((resp) => {
    if (resp.status === 200) return true;
    return false;
  });
  if (response) {
    closemodal();
  }
};

const makePostPublicHandle = async (postid, closemodal) => {
  const response = await makePostPublic(postid).then((resp) => {
    if (resp.status === 200) return true;
    return false;
  });
  if (response) closemodal();
};

const deletePostHandle = async (postid, modalclose, deleteproblemhandle) => {
  const response = await deletePost(postid).then((resp) => {
    if (resp.status === 200) return true;
    return false;
  });
  if (response) {
    modalclose();
  } else {
    deleteproblemhandle("Post cannot be deleted");
  }
};

const EditPostHandle = async (
  postid,
  posttitle,
  postcontent,
  endFunction,
  messagefunction
) => {
  if (posttitle === "" || postcontent === "") {
    messagefunction("Post title or post content cannot be empty");
    return;
  }
  const editedPostObject = {
    title: posttitle,
    content: postcontent,
  };
  const response = await editPost(postid, editedPostObject).then((resp) => {
    if (resp.status === 200) return resp.json();
    return 400;
  });
  if (response !== 400) {
    endFunction();
  } else {
    messagefunction("Post cannot be edited");
  }
};

const createPostHandle = async (
  title,
  content,
  makePostPrivate,
  tags,
  endFunction
) => {
  const newPost = {
    title: title,
    content: content,
    postPrivate: makePostPrivate,
    tags: tags,
  };
  const response = await createPost(newPost).then((resp) => {
    if (resp.status === 200) return true;
    return false;
  });
  if (response) endFunction();
};

const likeUserPost = async (postid, userid) => {
  const userobj = {
    userID: userid,
  };
  const response = await likePost(postid, userobj).then((resp) => {
    if (resp.status === 200) return true;
    return false;
  });
  return response;
};

const unlikeUserPost = async (postid, userid) => {
  const userobj = { userID: userid };
  const response = await removeLikePost(postid, userobj).then((res) => {
    if (res.status === 200) return true;
    return false;
  });
  return response;
};

const sortUserPost = async (sortoption, userid, savePostsInState) => {
  const sortObject = {
    userID: userid,
    sortOption: sortoption,
  };
  if (sortoption === "post_likes") {
    const sortedPosts = await sortPostByLikes(sortObject).then((res) => {
      if (res.status === 200) return res.json();
      return false;
    });
    if (sortedPosts !== false) {
      savePostsInState(sortedPosts);
    }
    return;
  }
  const sortedPosts = await sortPost(sortObject).then((res) => {
    if (res.status === 200) return res.json();
    return false;
  });
  if (sortedPosts !== false) {
    savePostsInState(sortedPosts);
  }
  return;
};

const findPostsByTagName = async (tagname) => {
  const tagobject = {
    username: tagname,
  };
  const postWithTagResponse = await getPostsByTag(tagobject).then((resp) => {
    if (resp.status === 200) return resp.json();
    return null;
  });
  if (postWithTagResponse === null) throw new Error("Error");
  return postWithTagResponse;
};

export {
  makePostPrivateHandle,
  makePostPublicHandle,
  deletePostHandle,
  EditPostHandle,
  createPostHandle,
  likeUserPost,
  unlikeUserPost,
  sortUserPost,
  findPostsByTagName
};
