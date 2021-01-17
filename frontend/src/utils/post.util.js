import { makePostPublic, makePostPrivate,deletePost } from "../api/postApi";

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
const deletePostHandle = async(postid,modalclose,deleteproblemhandle)=>{
    const response = await deletePost(postid).then(resp=>{
        if(resp.status === 200)
            return true;
        return false;
    });
    if(response){
        modalclose();
    }else{
        deleteproblemhandle("Post cannot be deleted");
    }
}

export {makePostPrivateHandle,makePostPublicHandle,deletePostHandle}