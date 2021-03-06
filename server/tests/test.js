/* eslint-disable */

import chai from 'chai';
import  chaiHttp from'chai-http';
import  app from '../app';


chai.use(chaiHttp);

const { expect } = chai;


const newParty = {
  "name": "partyA",
  "hqAddress": "Kigali",
  "logoUrl": "https://www.google.com/url?sa=i&sourcd=2ahUKEwjl",
};
const newOffice = {
  "type": "Legislative",
  "name": "Kigali",
};

const newName ={
  "name": "Butare",
};
let partyID = null;
let officeID = null;
let tokenAdmin = null; 
let tokenUser = null; 
before((done) =>{

  const userLogins = {
    email : 'niksam@gmail.com',
    password :'niyitanga',
  };
  const adminLogins = {
   email : 'niyitangasam@gmail.com',
   password :'niyitanga', 
  }


  chai.request(app).post('/api/v1/auth/login').send(userLogins)
    .end((err, res)=> {
      tokenUser = res.body.data[0].token;
    });

  chai.request(app).post('/api/v1/auth/login').send(adminLogins)
    .end((err, res)=> {
      tokenAdmin = res.body.data[0].token;
      done();
    });
});

describe('POST /parties', () => {
  it('It should add new party and return an object with a status code and a new part created', (done) => {
    chai.request(app).post('/api/v1/parties/').set('authorization',tokenAdmin).send(newParty).end((err, res) => { 
      partyID = res.body.data[0].id_party;
      console.log(partyID);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data').and.to.be.an('array');
      expect(res.body.status).to.be.a('number').and.to.equal(201);
      done();
    });
  });	
});

describe('GET /parties/<party-id>', () => {
  it('It should get party by id ', (done) => {
    chai.request(app).get(`/api/v1/parties/${partyID}`).set('authorization',tokenAdmin).end((err, res) => {
       console.log(`the body is ${res.body}`);
      expect(res).to.have.status(200);
      done();
    });
  });
  it('Once provided wrong ID, It should say that it is invalid', (done) => {
    chai.request(app).get('/api/v1/parties/125x').set('authorization',tokenAdmin).end((err, res) => {
      expect(res).to.have.status(500);
      done();
    });
  });	
});

describe('/GET Parties', () => {
  it('It should return all parties', (done) => {
    chai.request(app).get('/api/v1/parties').set('authorization',tokenUser).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data').and.to.be.an('array');
      done();
    });
  });
});

describe('PATCH /parties/<party-id>/name', () => {
  it('It should update only the name and return object with updated data', (done) => {
    chai.request(app).patch('/api/v1/parties/1/name').set('authorization',tokenAdmin).send(newName).end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });
});

describe('DELETE /parties/<party-id>', () => {
  it('It should delete data and return deleted data', (done) => {
    chai.request(app).delete('/api/v1/parties/1').set('authorization',tokenAdmin).end((err, res) => {
     expect(res).to.have.status(200);
      done();
    });
  });
});


describe('POST /offices', () => {
  it('It should create new office and return an object with a status code and a new part created', (done) => {
    chai.request(app).post('/api/v1/offices').set('authorization',tokenAdmin).send(newOffice).end((err, res) => {
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data').and.to.be.an('array');
      done();
    });
  });	
});

describe('GET /offices', () => {
  it('It should return all offices', (done) => {
    chai.request(app).get('/api/v1/offices').set('authorization',tokenUser).end((err, res) => {
      officeID = res.body.data[0].id_office;
      console.log(officeID);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data').and.to.be.an('array');
      done();
    });
  });
});

describe(`GET /offices/<office-id>`, () => {
  it('It should fetch office by id ', (done) => {
    chai.request(app).get(`/api/v1/offices/${officeID}`).set('authorization',tokenAdmin).end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });
  it('Once provided wrong ID, It should say that it is invalid', (done) => {
    chai.request(app).get('/api/v1/offices/dghds4').set('authorization',tokenAdmin).end((err, res) => {
      expect(res).to.have.status(500);
      done();
    });
  });	
});


describe('POST auth/signup', () => {
  it('should return status 201 when new user record is created', (done) => {
    const user= {
      firstname: "Ntanga",
      lastname:"Samuel",
      othername:"Nikobahoze", 
      email:"butare@gmail.com", 
      password:"niyitanga", 
      phoneNumber:"0788783963", 
      passportUrl:"https://hhhhnimage.ph", 
      isAdmin:"true"
    };
    chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.a('number');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.have.property('token').to.be.a('string');
        expect(res.body.data[0]).to.have.property('user').to.be.an('array');
        done();
      });
  });

  it('should return status 409 when user signs up with already existing fields.', (done) => {
      const user= {
      firstname: "Ntanga",
      lastname:"Samuel",
      othername:"Nikobahoze", 
      email:"butare@gmail.com", 
      password:"niyitanga", 
      phoneNumber:"0788783963", 
      passportUrl:"https://hhhhnimage.ph", 
      isAdmin:"true"
    };
    chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body.status).to.be.a('number').and.to.be.equal(409);
        expect(res.body).to.have.property('error').and.to.be.a('string');
        done();
      });
  });
});


describe('POST /auth/signin', () => {
  it('should return status 200 with when sign in is successful.', (done) => {
    const logins = {
      email: 'butare@gmail.com',
      password: 'niyitanga',
    };
    chai.request(app).post('/api/v1/auth/login').send(logins).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.a('number');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.have.property('token').to.be.an('string');
        expect(res.body.data[0]).to.have.property('user').to.be.an('object');
        expect(res.body.data[0].user).to.have.property('email').to.be.an('string');
        expect(res.body.data[0].user.email).to.be.equals(logins.email);
        done();
      });
  });
});


