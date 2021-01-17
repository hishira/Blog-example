import {
  makePostPublic,
  makePostPrivate,
  deletePost,
  editPost,
  createPost,
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
  if(response)
    endFunction();
};
export {
  makePostPrivateHandle,
  makePostPublicHandle,
  deletePostHandle,
  EditPostHandle,
  createPostHandle,
};
