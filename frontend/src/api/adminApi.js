import {
  fetchObject,
  getApiLink,
  getFetchPutObject,
  getDeleteFetchObject,
} from "./configApi";

async function getAllUsers() {
  let url = getApiLink("users/users");
  return await fetch(url, fetchObject);
}
async function getUserInfo(id) {
  let url = getApiLink(`users/adminuserinfo/${id}`);
  return await fetch(url, fetchObject);
}
async function editUserInfo(id, obj) {
  let url = getApiLink(`users/useredit/${id}`);
  return await fetch(url, getFetchPutObject(obj));
}
async function getUserPosts(id) {
  let url = getApiLink(`post/userposts/${id}`);
  return await fetch(url, fetchObject);
}
async function getUserComments(id) {
  let url = getApiLink(`comment/usercomments/${id}`);
  return await fetch(url, fetchObject);
}
async function userCommentDelete(id,obj) {
  let url = getApiLink(`comment/comment/${id}`);
  return await fetch(url, getDeleteFetchObject(obj));
}
export {
  getAllUsers,
  getUserInfo,
  editUserInfo,
  getUserPosts,
  getUserComments,
  userCommentDelete
};
