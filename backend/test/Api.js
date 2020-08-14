let User = require("../models/User");
let Post = require("../models/Post");
let Comment = require("../models/Comment");
let mongoose = require('mongoose');
let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../appTest").app;
let connection = require("../appTest").connection;
let schould = chai.should();
const request = require("supertest");
let checkPostObject = require("../middleware/testHelperFunctions.js").checkPostObject
process.removeAllListeners("warning");
chai.use(require('chai-json'))
chai.use(chaiHttp);
let server;
let agent
let agent2
let agent3
let user
describe("Users", () => {
  before(async () => {
    await connection();
    server = app.listen(9000, () => console.log("App work"));
    agent = request.agent(server)
    agent2 = request.agent(server)
    agent3 = request.agent(server)
    await agent2.post("/auth/login").send({
      email: "admin@admin.com",
      password: "123456",
    })
    await agent3.post("/auth/login").send({
      email: "xyz@xyz.com",
      password: "123456"
    })
    await Post.create({
      _id:mongoose.Types.ObjectId("5f170ecc76fdda09dce2a0fd"),
      title:"test2",
      content:"test2",
      user:"5f1f04cbf608e7b47083eaba",
    })
    await Post.create({
      _id:mongoose.Types.ObjectId("5f170ecd76fdda09dce2a0fd"),
      title:"test3",
      content:"test3",
      user:"5f1f04cbf608e7b47083eaba"
    })
    await Post.create({
      _id:mongoose.Types.ObjectId("507f191e810c19729de860ea"),
      title:"test4",
      content:"test4",
      user:"5f1f04cbf608e7b47083eaba"
    })
    await Comment.create({
      _id:mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
      content:"test5",
      post:"507f191e810c19729de860ea",
      user:"5f1f04cbf608e7b47083eaba"
    })
    await Comment.create({
      _id:mongoose.Types.ObjectId("508f1f77bcf86cd799439011"),
      content:"test6",
      post:"507f191e810c19729de860ea",
      user:"5f1f04cbf608e7b47083eaba"
    })
    let u  = await User.create({
      _id:"5f22c61adb3d593427e8a98a",
      email:"123@123.com",
      username:"123",
      password:"123456"
    })
    let k  = await User.create({
      _id:"5f23026c1ebf13da73c64712",
      email:"1234@1234.com",
      username:"1234",
      password:"123456"
    })
    await k.save()
    await u.save()
  });
  describe("/GET users", () => {
    it("GET all users if only admin", (done) => {
      chai
        .request(server)
        .get("/users/users")
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe("/POST wrong login user", () => {
    it("It schould do not login user with wrong password", (done) => {
      let user = {
        email: "admin@admin.com",
        password: "12356",
      };
      chai
        .request(server)
        .post("/auth/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
        });
      done();
    });
    it("It schould do not login user with wrong  email", (done) => {
      let user = {
        email: "admin@adm.com",
        password: "123456",
      };
      chai
        .request(server)
        .post("/auth/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
        });
      done();
    });
    it("It schould pass user with good password and email", (done) => {
      let user = {
        email: "admin@admin.com",
        password: "123456",
      };
      chai
        .request(server)
        .post("/auth/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
        });
      done();
    });
  });
  describe("Check if user can get other users not being loged in as admin, and beeing logged in", () => {
    it("GET loged in, check if status 200 and get user object", (done) => {
      let user = {
        email: "admin@admin.com",
        password: "123456",
      };
      agent
        .post("/auth/login")
        .set('Accept','application/json')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        });
    });
    it("GET users while admin and loged in", (done) => {
        agent
        .get("/users/users")
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
          done();
        });
    });
    it("GET loged out", (done) => {
        agent
        .get("/auth/logout")
        .expect(400)
        .end((err, res) => {
            res.should.have.status(200)
          done();
        });
    });
    it("GET check if logout work, we try to get users after logout", (done) => {
        agent
        .get("/users/users")
        .expect(400)
        .end((err, res) => {
            res.should.have.status(400)

            done();
        });
        
    });
  });
  describe("Check function to create users", () => {
    it("We cannot create users with email that exists", done => {
      let user = {
        email: "admin@admin.com",
        password: "123456"
      }
      chai.request(server).post('/auth/register').send(user).end((err, res) => {
        res.should.have.status(400)
        done()
      })
    })
    it('We cannot create user with to short password(min 6 characters)',(done)=>{
      let user = {
        email:"test@test.com",
        password:"12345"
      }
      chai.request(server).post('/auth/register').send(user).end((err, res)=>{
        res.should.have.status(500)
        done()
      })
    })
    it("We cannot create user with wrong email",(done)=>{
      let user = {
        email:"test@test",
        password:"123456"
      }
      chai.request(server).post('/auth/register').send(user).end((err, res)=>{
        res.should.have.status(500)
        done()
      })
    })
    it("We can create user with good email and password",(done) =>{
      let user = {
        email:"test@test.com",
        username:"test",
        password:"123456"
      }
      chai.request(server).post('/auth/register').send(user).end((err, res) => {
        res.should.have.status(200)
        done()
      })
    })
  })
  describe("Check post", ()=>{
    it("User can not get all post if do not be admin",(done)=>{
      chai.request(server)
      .get('/post/posts')
      .end((end,res)=>{
        res.should.have.status(400)
        done()
      })
      
    })
    it("Looged admin can get posts", (done)=>{
      agent2.get('/post/posts').end((err,res)=>{
        res.should.have.status(200)
        done()
      })      
    })
    it("Logged normal user can not get all posts",(done)=>{
      agent3.get('/post/posts').end((err,res)=>{
        res.should.have.status(400)
        done()
      })
    })
    it("Not loged users cannot get public posts",(done)=>{
      chai.request(server).get('/post/publicposts')
      .end((err,res)=>{
        res.should.have.status(400)
        done()
      })
    })
    it("Logged admin user can get public posts",(done)=>{
      agent2.get('/post/publicposts').end((err,res)=>{
        res.should.have.status(200)
        done()
      })
    })
    it("Logged normal user can get public posts",(done)=>{
      agent3.get('/post/publicposts').end((err,res)=>{
        res.should.have.status(200)
        res.body.should.be.a('array')
        done()
      })
    })
    it("Normal users cannot get all private posts",(done)=>{
      agent3.get('/post/privateposts').end((err,res)=>{
        res.should.have.status(400)
        done()
      })
    })
    it("Admin user can get all private posts",(done)=>{
      agent2.get('/post/privateposts').end((err,res)=>{
        res.should.have.status(200)
        res.body.should.be.a('array')
        done()
      })
    })
    it("Not logged users cannot get their posts",(done)=>{
      agent.get('/post/userposts').end((err,res)=>{
        res.should.have.status(400)
        done()
      })
    })
    it("Logged user can get their posts",(done)=>{
      agent2.get('/post/userposts').end((err,res)=>{
        res.should.have.status(200)
        res.body.should.be.a('array')
        done()
      })
    })
    it("Return object with public post with comment by id", (done)=>{
      agent.get("/post/publicuserpost/5f170ecc76fdda09dce2a0fd").end((err,res)=>{
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.be.a.jsonObj()
        checkPostObject(res)
        done()
      })
    })
    it("Not logged user cannot add post",(done) =>{
      let post = {
        title:"Test",
        content:"Test"
      }
      chai.request(server).post('/post/post').send(post).end((err,res)=>{
        res.should.have.status(400)
        done()
      })
    })
    it("Only logged user can add post",(done)=>{
      let post = {
        title: "Test",
        content: "Test",
        postPrivate:false
      }
      agent2.post('/post/post').send(post).end((err,res)=>{
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.be.an('object').have.property('createDate')
        res.body.should.be.an('object').have.property('editingDate')
        done()
      })
    })
    it("Not logged user cannot edit post",(done)=>{
      let updatePost = {
        title: "Test",
        content: "Test content",
      }
      agent.put("/post/post/5f170ecd76fdda09dce2a0fd").send(updatePost).end((err, res) => {
        res.should.have.status(400)
        done()
      })
    })
    it("Only Logged users can edit post",(done)=>{
      let updatedPost = {
        title: "Updated",
        content: "Updated content"
      }
      agent2.put('/post/post/5f170ecd76fdda09dce2a0fd').send(updatedPost).end((err, res)=>{
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.be.an('object').have.property('createDate')
        res.body.should.be.an('object').have.property('editingDate')
        done()
      })
    })
    it("Logged user can make post private",(done) => {
      agent2.put('/post/postprivate/5f170ecd76fdda09dce2a0fd').send({}).end((err, res)=>{
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.be.an('object').have.property('createDate')
        res.body.should.be.an('object').have.property('editingDate')
        done()
      })
    })
    it("Not logged user, cannot make post private",(done)=>{
      agent.put("/post/postprivate/5f170ecd76fdda09dce2a0fd").send({}).end((err, res)=>{
        res.should.have.status(400)
        done()
      })
    })
    it("Only logged user can make private post public",(done) => {
      agent2.put('/post/publicpost/5f170ecd76fdda09dce2a0fd').send({}).end((err, res) =>{
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.be.an('object').have.property('createDate')
        res.body.should.be.an('object').have.property('editingDate')
        done()
      })
    })
    it("Not logged user, cannot make private post public",(done)=>{
      agent.put('/post/publicpost/5f170ecd76fdda09dce2a0fd').send({}).end((err, res)=> {
        res.should.have.status(400)
        done()
      })
    })
    it("Not logged user cannot delete post",(done)=>{
      chai.request(server).delete('/post/post/5f170ecd76fdda09dce2a0fd').end((err,res)=>{
        res.should.have.status(400)
        done()
      })
    })
    it("Loggged user can delete post",(done)=>{
      agent2.delete('/post/post/5f170ecd76fdda09dce2a0fd').end((err,res)=>{
        res.should.have.status(200)
        done()
      })
    })
    it("Incorrect post id get server error 500",done=>{
      agent2.delete('/post/post/2').end((err,res)=>{
        res.should.have.status(500)
        done()
      })
    })
    it("Deleted post id get error 404",done=>{
      agent2.delete('/post/post/5f170ecd76fdda09dce2a0fd').end((err,res)=>{
        res.should.have.status(404)
        done()
      })
    })
  })
  describe("Check comments routes",()=>{
    it("Only admin can get all comments",(done)=>{
      agent2.get('/comment/comments').end((err,res)=>{
        res.should.have.status(200)
        res.body.should.be.an('array')
        done()
      })
    })
    it("Normal users cannot get all comments",(done)=>{
      agent3.get('/comment/comments').end((err,res)=>{
        res.should.have.status(400)
        done()
      })
    })
    it("Not logged user cannot add comment to post",(done)=>{
      let obj = {
        content: "Ok post",
        postID: "5f170ecd76fdda09dce2a0fd"
      }
      chai.request(server).post("/comment/comment").send(obj).end((err,res)=>{
        res.should.have.status(400)
        done()
      })
    })
    it("Cannot add comment to post which do not exists",(done)=>{
      let obj = {
        content: "Ok post",
        postID: "5f170ecd76fdda09dce2a0zd"
      }
      agent2.post('/comment/comment').send(obj).end((err,res)=>{
        res.should.have.status(404)
        done()
      })
    })
    it("Correct adding comment to post", (done) => {
      let obj = {
        content: "Ok post",
        postID: "5f170ecc76fdda09dce2a0fd"
      }
      agent2.post('/comment/comment').send(obj).end((err,res)=>{
        res.should.have.status(200)
        done()
      })
    })
    it("Affter post adding, comment id must be in post and user",(done) => {
      agent2.get('/post/publicuserpost/5f170ecc76fdda09dce2a0fd').end((err,res)=>{
        res.should.have.status(200)
        res.body.should.have.property('post').have.property('comments').to.be.an('array').to.have.length(1)
        done()
      })
    })
    it("Cannot delete post that not exists",(done)=>{
      agent2.delete('/comment/comment/5f170ecc76fdda09dce2a0fd').end((err,res)=>{
        res.should.have.status(404)
        done()
      })
    })
    it("Should delete comment with correct id",(done)=>{
      agent2.delete("/comment/comment/507f1f77bcf86cd799439011").end((err,res)=>{
        res.should.have.status(200)
        done()
      })
    })
    it("Cannot edit comment that do not exists",(done)=>{
      let obj = {
        content:"Ok test"
      }
      agent2.put('/comment/comment/507f1f79bcf86cd799439011').send(obj).end((err,res)=>{
        res.should.have.status(404)
        done()
      })
    })
    it("User can edit comment with good id",(done) => {
      let obj = {
        content:"Ok test"
      }
      agent2.put("/comment/comment/508f1f77bcf86cd799439011").send(obj).end((err,res)=>{
        res.should.have.status(200)
        done()
      })
    })
  })
  describe("User reoutes",()=>{
    it("Admin can delete user",(done)=>{
      agent2.delete("/users/user/5f22c61adb3d593427e8a98a").end((err,res)=>{
        res.should.have.status(200)
        done()
      })
    })
    it("Admin can not delete user that not exists",(done)=>{
      agent2.delete("/users/user/5f22c61adb3d593227e8a98a").end((err,res)=>{
        res.should.have.status(404)
        done()
      })
    })
    it("user can change email",(done)=>{
      let obj = {
        email:"let@let.com"
      }
      agent3.put('/users/emailchange').send(obj).end((err,res)=>{
        res.should.have.status(200)
        done()
      })
    })
    it("One more time, user can change email",(done)=>{
      let obj = {
        email:"xyz@xyz.com"
      }
      agent3.put('/users/emailchange').send(obj).end((err,res)=>{
        res.should.have.status(200)
        done()
      })
    })
    it("Normal user cannot change user role",(done)=>{
      agent3.put('/users/rolechange/5f23026c1ebf13da73c64712').send({}).end((err,res)=>{
        res.should.have.status(400)
        done()
      })
    })
    it("Admin can change user role",(done)=>{
      agent2.put('/users/rolechange/5f23026c1ebf13da73c64712').send({}).end((err,res)=>{
        res.should.have.status(200)
        done()
      })
    })
    it("Admin can get all users",(done)=>{
      agent2.get('/users/users').end((err,res)=>{
        res.should.have.status(200)
        res.body.should.be.an('array')
        done()
      })
    })
  })
  after(async function(){
    await Post.findOneAndDelete({title:"Test"})
    await Post.findByIdAndDelete("5f170ecc76fdda09dce2a0fd")
    await Post.findByIdAndDelete("5f170ecd76fdda09dce2a0fd")
    await Post.findByIdAndDelete("507f191e810c19729de860ea")
    await Comment.deleteMany({})
    await User.findOneAndDelete({email:"test@test.com"})
    await User.findOneAndDelete({email:"123@123.com"})
    await User.findOneAndDelete({email:"1234@1234.com"})
    await Comment.findOneAndDelete({post: "5f170ecd76fdda09dce2a0fd"})
    await Comment.findByIdAndRemove("508f1f77bcf86cd799439011")
    let user = await User.findOne({email:"admin@admin.com"})
    user.posts = []
    user.comments = []
    await user.save()
    server.close()
    
  })
});
