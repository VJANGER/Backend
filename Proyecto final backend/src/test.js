const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Product Router', () => {
  it('should get a list of products', (done) => {
    chai
      .request(app)
      .get('/api/products')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should get a single product by ID', (done) => {
    chai
      .request(app)
      .get('/api/products/your-product-id')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should create a new product', (done) => {
    const newProduct = {
      title: 'New Product',
      category: 'Category',
    };

    chai
      .request(app)
      .post('/api/products')
      .send(newProduct)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
