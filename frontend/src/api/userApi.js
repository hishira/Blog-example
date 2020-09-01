import {
  getFetchPostObject,
  getApiLink,
  fetchObject,
  getFetchPutObject,
} from "./configApi.js";

async function getUserInfo() {
  let url = getApiLink("users/userinfo");
  return await fetch(url, fetchObject);
}
async function addUserDescription(obj) {
  let url = getApiLink("users/descriptionchange");
  return await fetch(url, getFetchPutObject(obj));
}
async function emailChange(obj) {
  let url = getApiLink("users/emailchange");
  return await fetch(url, getFetchPutObject(obj));
}
async function passwordChange(obj) {
  let url = getApiLink("users/passwordchange");
  return await fetch(url, getFetchPutObject(obj));
}
async function userFind(obj) {
  let url = getApiLink("users/userfind");
  return await fetch(url, getFetchPostObject(obj));
}
async function getPublicUserInfo(id) {
  let url = getApiLink(`users/userpublicprofile/${id}`);
  return await fetch(url, fetchObject);
}
async function watchUser(obj){
  let url = getApiLink("users/watchUser")
  return await fetch(url,getFetchPostObject(obj))
}
async function unwatchUser(obj){
  let url = getApiLink("users/unwatchUser")
  return await fetch(url,getFetchPostObject(obj))
}
export {
  getUserInfo,
  addUserDescription,
  emailChange,
  passwordChange,
  userFind,
  getPublicUserInfo,
  watchUser,
  unwatchUser
};
