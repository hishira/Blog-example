function checkPostObject(res){
    res.body.should.have.property('post').have.property('createDate')
    res.body.should.have.property('post').have.property('editingDate')
    res.body.should.have.property('post').have.property('postType')
    res.body.should.have.property('post').have.property('title')
    res.body.should.have.property('post').have.property('content')
    res.body.should.have.property('comments')
}


module.exports = {checkPostObject}