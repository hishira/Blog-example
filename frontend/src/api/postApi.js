import {getFetchPostObject,getApiLink, fetchObject,getFetchPutObject,fetchDeleteObject} from './configApi.js'

async function createPost(obj){
    let url = getApiLink('post/post')
    return await fetch(url,getFetchPostObject(obj))
}
async function editPost(id,obj){
    let url = getApiLink(`post/post/${id}`)
    return await fetch(url,getFetchPutObject(obj))
}
async function deletePost(id){
    let url = getApiLink(`post/post/${id}`)
    return await fetch(url,fetchDeleteObject)
}
export {createPost,editPost,deletePost}