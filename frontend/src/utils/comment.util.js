import {
  createComment,
  createAnonymousComment,
  getCommentsByPost,
  sortComments,
} from "../api/commentApi";

const createUserComment = async (newcomment, messagefunction) => {
  const response = await createComment(newcomment).then((resp) => {
    if (resp.status === 200) return true;
    return false;
  });
  if (!response) {
    messagefunction("Comment cannot be add");
    return false;
  }
  return true;
};

const createAnnonymousComment = async (newcomment, messagefunction) => {
  const response = await createAnonymousComment(newcomment).then((res) => {
    if (res.status === 200) {
      return true;
    }
    return false;
  });
  if (!response) {
    messagefunction("Comment cannot be add");
    return false;
  }
  return true;
};

const createCommentHandle = async (
  postid,
  content,
  loogeduserstatus,
  messageFunction
) => {
  if (content === "") {
    messageFunction("Comment cannot be add");
    return;
  }
  const newComment = {
    content: content,
    postID: postid,
  };
  if (loogeduserstatus) {
    return await createUserComment(newComment, messageFunction);
  } else {
    return await createAnnonymousComment(newComment, messageFunction);
  }
};

const fetchCommentForPost = async (postid) => {
  const sendObject = {
    postID: postid,
  };
  const commentsForPost = await getCommentsByPost(sendObject).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else return false;
  });
  if (commentsForPost === false) {
    throw new Error("Error");
  }
  return commentsForPost;
};
const sortPosts = async (postid, sortoption) => {
  if (sortoption === "") {
    return [];
  }
  const sendObject = {
    postID: postid,
    sortOption: sortoption,
  };
  const response = await sortComments(sendObject).then((res) => {
    if (res.status === 200) {
      return res.json();
    }
    return [];
  });
  return response;
};
export { createCommentHandle, fetchCommentForPost, sortPosts };
