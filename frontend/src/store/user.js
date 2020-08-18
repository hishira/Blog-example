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
}
decorate(UserStore,{
    logedUser:observable,
    watchedUser:observable,
    getLogedUser:computed,
    getWatchedUser:computed
})