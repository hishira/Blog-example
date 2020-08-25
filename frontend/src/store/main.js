import {observable,computed,action,decorate} from 'mobx'

export default class MainStore{
    isLoged = false
    descriptiopnModal = false
    commentModal = false
    postComments = false
    editPostModal = false
    deletePostModal = false
    editTypePostModal = false
    loginModal = false
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
    setEditPostModal(value){
        this.editPostModal = value
    }
    setDeletePostModal(value){
        this.deletePostModal = value
    }
    setEditTypePostModal(value){
        this.editTypePostModal = value
    }
    setLoginModal(value){
        this.loginModal = value
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
    editPostModal:observable,
    deletePostModal:observable,
    editTypePostModal:observable,
    loginModal:observable,
    setLogged:action,
    getLogStatus:computed,
    setModal: action,
    setCommentModal:action,
    setCommentsForPost: action,
    setEditPostModal:action,
    setDeletePostModal:action,
    setEditTypePostModal:action,
    setLoginModal:action,
})