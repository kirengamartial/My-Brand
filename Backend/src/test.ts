import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index'; 

chai.use(chaiHttp);
const expect = chai.expect;

describe('Contact Message API', () => {
  it('should return an array of messages', (done) => {
    chai.request(app)
      .get('/contact/message')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});
