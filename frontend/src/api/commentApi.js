import {getFetchPostObject,getApiLink, fetchObject,getFetchPutObject} from './configApi.js'

async function createComment(obj){
    let url = getApiLink('comment/comment')
    return await fetch(url,getFetchPostObject(obj))
}

export {createComment}
