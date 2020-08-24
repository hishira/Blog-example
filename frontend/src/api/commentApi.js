import {getFetchPostObject,getApiLink, fetchObject,getFetchPutObject} from './configApi.js'

async function createComment(obj){
    let url = getApiLink('comment/comment')
    return await fetch(url,getFetchPostObject(obj))
}
async function createAnonymousComment(obj){
    let url = getApiLink("comment/annonymousCommment")
    return await fetch(url,getFetchPostObject(obj))
}
async function getCommentsByPost(obj){
    let url = getApiLink('comment/commentforpost')
    return await fetch(url,getFetchPostObject(obj))
}
async function sortComments(obj){
    let url = getApiLink("comment/sortcomment")
    return await fetch(url,getFetchPostObject(obj))
}

export {createComment,getCommentsByPost,createAnonymousComment,sortComments}
