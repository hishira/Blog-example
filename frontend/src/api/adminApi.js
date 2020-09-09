import {fetchObject,getApiLink,getFetchPutObject} from './configApi'

async function getAllUsers(){
    let url = getApiLink("users/users")
    return await fetch(url,fetchObject)
}
async function getUserInfo(id){
    let url = getApiLink(`users/adminuserinfo/${id}`)
    return await fetch(url,fetchObject)
}
async function editUserInfo(id,obj){
    let url = getApiLink(`users/useredit/${id}`)
    return await fetch(url,getFetchPutObject(obj))
}
async function getUserPosts(id){
    let url = getApiLink(`post/userposts/${id}`)
    return await fetch(url,fetchObject)
}
async function getUserComments(id){
    let url = getApiLink(`comment/usercomments/${id}`)
    return await fetch(url,fetchObject)
}

export {getAllUsers,getUserInfo,editUserInfo,getUserPosts,getUserComments}