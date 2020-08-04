import {observable,computed,action,decorate} from 'mobx'

export default class MainStore{
    isLoged = false
    descriptiopnModal = false
    constructor(user){
        if(user){
            this.isLoged = true
        }
    }
    setLogged(value){
        this.isLoged = value
    }
    setModal(value){
        this.descriptiopnModal = value
    }
    get getLogStatus(){
        return this.isLoged
    }
}
decorate(MainStore,{
    isLoged:observable,
    descriptiopnModal:observable,
    setLogged:action,
    getLogStatus:computed,
    setModal: action
})