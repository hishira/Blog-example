import {observable,computed,action,decorate} from 'mobx'

export default class MainStore{
    isLoged = false
    descriptiopnModal = false
    commentModal = false
    postComments = false
    editPostModal = false
    deletePostModal = false
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
    setLogged:action,
    getLogStatus:computed,
    setModal: action,
    setCommentModal:action,
    setCommentsForPost: action,
    setEditPostModal:action,
    setDeletePostModal:action
})