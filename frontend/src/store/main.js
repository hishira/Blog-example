import {observable,computed,action,decorate} from 'mobx'

export default class MainStore{
    isLoged = false
    descriptiopnModal = false
    commentModal = false
    postComments = false
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
    setCommentModal(value){
        this.commentModal = value
    }
    setCommentsForPost(value){
        this.postComments = value
    }
    get getLogStatus(){
        return this.isLoged
    }
}
decorate(MainStore,{
    isLoged:observable,
    descriptiopnModal:observable,
    commentModal:observable,
    postComments: observable,
    setLogged:action,
    getLogStatus:computed,
    setModal: action,
    setCommentModal:action,
    setCommentsForPost: action
})