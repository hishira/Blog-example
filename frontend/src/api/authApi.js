import {getFetchPostObject,getApiLink, fetchObject} from './configApi.js'

async function login(obj){
    let url = getApiLink('auth/login')
    return await fetch(url,getFetchPostObject(obj))
}
async function logout(){
    let url = getApiLink('auth/logout')
    return await fetch(url,fetchObject)
}
async function register(obj){
    let url = getApiLink('auth/register')
    return await fetch(url,getFetchPostObject(obj))
}
async function checkLogin(){
    let url = getApiLink('auth/checklogged')
    return await fetch(url,fetchObject)
}
export  {login,register,logout,checkLogin}