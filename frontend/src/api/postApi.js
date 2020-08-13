import {getFetchPostObject,getApiLink, fetchObject,getFetchPutObject} from './configApi.js'

async function createPost(obj){
    let url = getApiLink('post/post')
    return await fetch(url,getFetchPostObject(obj))
}
async function editPost(id,obj){
    let url = getApiLink(`post/post/${id}`)
    return await fetch(url,getFetchPutObject(obj))
}
export {createPost,editPost}