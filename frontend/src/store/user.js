import {observable,computed,action,decorate,toJS} from 'mobx';

export default class UserStore{
    logedUser = {}
    watchedUser = {}
    constructor(user){
        this.logedUser = user
    }
    setLogedUser(user){
        this.logedUser = user
    }
    setWatchedUser(user){
        this.watchedUser = user
    }
    get getLogedUser(){
        return toJS(this.logedUser)
    }
    changeWathcedArray(){
        this.logedUser.watched.length -=1
    }
    get getWatchedUser(){
        return toJS(this.watchedUser)
    }
    setLogedUserPost(post){
        this.logedUser.posts = post
    }
    setWatchedUserPost(post){
        this.watchedUser.posts = post
    }
}
decorate(UserStore,{
    logedUser:observable,
    setLogedUser:action,
    setWatchedUser:action,
    watchedUser:observable,
    getLogedUser:computed,
    getWatchedUser:computed,
    changeWathcedArray:action,
    setLogedUserPost:action,
    setWatchedUserPost:action,
})