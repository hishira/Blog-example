import {observable,computed,action,decorate,toJS} from 'mobx';

export default class UserStore{
    logedUser = {}
    watchedUser = {}
    setLogedUser(user){
        this.logedUser = user
    }
    setWatchedUser(user){
        this.watchedUser = user
    }
    get getLogedUser(){
        return toJS(this.logedUser)
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
    setLogedUserPost:action,
    setWatchedUserPost:action,
})