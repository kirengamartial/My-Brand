import { describe, it, before } from 'mocha';
import app from './index.js';
import request from 'supertest';
import { expect } from 'chai';
before(function (done) {
    app.listen(3001, () => {
        console.log(`Server is running on port 3001`);
    });
    setTimeout(done, 1000);
});
after(function () {
    process.exit();
});
describe('Contact Message API', () => {
    describe('handle 200 status code for messages', () => {
        it('Create a new contact message', function (done) {
            const contactMessage = {
                name: "martial",
                email: "marc@gmail.com",
                question: "what is an ecommerce",
                description: "build an ecommerce please"
            };
            request(app)
                .post('/contact')
                .send(contactMessage)
                .expect(200)
                .end((err, res) => {
                if (err)
                    return done(err);
                expect(res.body).to.be.an('object');
                done();
            });
        });
        it('should return an array of messages', function (done) {
            this.timeout(15000);
            request(app)
                .get('/contact/message')
                .expect(200)
                .end((err, res) => {
                if (err)
                    return done(err);
                expect(res.body).to.be.an('array');
                done();
            });
        });
    });
});
describe('Login API', () => {
    it('should login with valid credentials', function (done) {
        const credentials = {
            email: 'kirenga@gmail.com',
            password: 'kirenga'
        };
        request(app)
            .post('/login')
            .send(credentials)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            console.log(res.body.user.isAdmin);
            expect(res.body).to.have.property('user');
            done();
        });
    });
    // Test logging in with invalid credentials
    it('should not login with invalid credentials', function (done) {
        const invalidCredentials = {
            email: 'invalidemail@gmail.com',
            password: 'invalidpassword'
        };
        request(app)
            .post('/login')
            .send(invalidCredentials)
            .expect(400)
            .end((err, res) => {
            if (err)
                return done(err);
            expect(res.body).to.have.property('message', 'email is incorrect');
            done();
        });
    });
    // Test logging in with missing fields
    it('should not login with missing fields', function (done) {
        const missingFields = {};
        request(app)
            .post('/login')
            .send(missingFields)
            .expect(400)
            .end((err, res) => {
            if (err)
                return done(err);
            expect(res.body).to.have.property('message', 'fill all the fields please');
            done();
        });
    });
});
describe('Blog API', () => {
    let createdBlogId;
    it('should create a new blog', function (done) {
        this.timeout(15000);
        const newBlogData = {
            photo: 'url_to_photo',
            title: 'New Blog Title',
            description: 'Description of the new blog'
        };
        request(app)
            .post('/blog')
            .send(newBlogData)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            console.log(res.body);
            expect(res.body.message).to.equal('created a blog successfully');
            createdBlogId = res.body.id;
            done();
        });
    });
    it('should return a single blog by ID', function (done) {
        this.timeout(15000);
        request(app)
            .get(`/api/blog/${createdBlogId}`)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            expect(res.body).to.be.an('object');
            done();
        });
    });
    it('should update an existing blog', function (done) {
        this.timeout(15000);
        const updatedBlogData = {
            photo: 'updated_url_to_photo',
            title: 'Updated Blog Title',
            description: 'Updated description of the blog'
        };
        request(app)
            .put(`/blog/${createdBlogId}`)
            .send(updatedBlogData)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            expect(res.body).to.be.an('object');
            done();
        });
    });
    it('should delete an existing blog', function (done) {
        this.timeout(15000);
        request(app)
            .delete(`/blog/${createdBlogId}`)
            .expect(204)
            .end((err, res) => {
            if (err)
                return done(err);
            expect(res.body).to.be.empty;
            done();
        });
    });
});
//# sourceMappingURL=test.js.map