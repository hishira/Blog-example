import {fetchObject,getApiLink} from './configApi'

async function getAllUsers(){
    let url = getApiLink("users/users")
    return await fetch(url,fetchObject)
}
export {getAllUsers}