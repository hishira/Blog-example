import {
  getFetchPostObject,
  getApiLink,
  fetchObject,
  getFetchPutObject,
  fetchDeleteObject,
} from "./configApi.js";

async function createPost(obj) {
  let url = getApiLink("post/post");
  return await fetch(url, getFetchPostObject(obj));
}
async function editPost(id, obj) {
  let url = getApiLink(`post/post/${id}`);
  return await fetch(url, getFetchPutObject(obj));
}
async function deletePost(id) {
  let url = getApiLink(`post/post/${id}`);
  return await fetch(url, fetchDeleteObject);
}
async function makePostPublic(id) {
  let url = getApiLink(`post/publicpost/${id}`);
  return await fetch(url, getFetchPutObject({}));
}
async function makePostPrivate(id) {
  let url = getApiLink(`post/postprivate/${id}`);
  return await fetch(url, getFetchPutObject({}));
}
async function likePost(id,obj) {
  let url = getApiLink(`post/post/likeadd/${id}`);
  return await fetch(url, getFetchPostObject(obj));
}
async function removeLikePost(id,obj) {
  let url = getApiLink(`post/post/likeremove/${id}`);
  return await fetch(url, getFetchPostObject(obj));
}
async function sortPost(obj){
  let url = getApiLink('post/sortpost')
  return await fetch(url, getFetchPostObject(obj))
}
export {
  createPost,
  editPost,
  deletePost,
  makePostPublic,
  makePostPrivate,
  likePost,
  removeLikePost,
  sortPost
};
