import {getFetchPostObject,getApiLink, fetchObject} from './configApi.js'

async function createPost(obj){
    let url = getApiLink('post/post')
    return await fetch(url,getFetchPostObject(obj))
}

export {createPost}