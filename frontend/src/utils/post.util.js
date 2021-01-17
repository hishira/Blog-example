import { makePostPublic, makePostPrivate } from "../api/postApi";

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
  if(response)
    closemodal();
};

export {makePostPrivateHandle,makePostPublicHandle}