import app from '../lib/server.js';
import request from 'supertest';
import uuid from 'uuid';
import jwt from 'jsonwebtoken';

import authentication from '../lib/utility/authentication.js';
import config from '../lib/config';

describe('API Testing', () => {
  let testUser = 'test' + uuid();
  let token;
  before((done) => {
    let user = {
      username: testUser,
      password: testUser
    };
    token = authentication.getAccessToken(jwt, user, config.jwt);
    done();

  });

  describe('Users API', () => {

    describe('Login User', () => {

      it('Login User with Correct data', (done) => {
        function matchResponse(res) {
          if(!res.body.access_token) {
            throw new Error('Incorrect Information');
          }
        }
        let endpoint = '/users/login';
        let data = {
          username: testUser,
          password: testUser
        };
        testRequest(app, endpoint, 'post', null, data, 200, matchResponse, done);
      });

      it('Login User without Username', (done) => {
        function matchResponse(res) {
          if(!res.error) {
            throw new Error('Incorrect Information');
          }
        }
        let endpoint = '/users/login';
        let data = {
          password: testUser
        };
        testRequest(app, endpoint, 'post', null, data, 400, matchResponse, done);
      });

      it('Login User without Password', (done) => {
        function matchResponse(res) {
          if(!res.error) {
            throw new Error('Incorrect Information');
          }
        }
        let endpoint = '/users/login';
        let data = {
          username: testUser
        };
        testRequest(app, endpoint, 'post', null, data, 400, matchResponse, done);
      });

      it('Login User without request data', (done) => {
        function matchResponse(res) {
          if(!res.error) {
            throw new Error('Incorrect Information');
          }
        }
        let endpoint = '/users/login';
        let data = null;
        testRequest(app, endpoint, 'post', null, data, 400, matchResponse, done);
      });
    });
  });

  describe('Json Patch API', () => {
    it('Add Operation', (done) => {
      function matchResponse(res) {
        if(!res.body.test) {
          throw new Error('Incorrect Information');
        }
      }
      let endpoint = '/jsonpatch';
      let data = {
        document: {},
        patch: [{op: 'add', path: '/test', value: '1'}]
      };
      testRequest(app, endpoint, 'post', token, data, 200, matchResponse, done);
    });

    it('Remove Operation', (done) => {
      function matchResponse(res) {
        if(res.body.test) {
          throw new Error('Incorrect Information');
        }
      }
      let endpoint = '/jsonpatch';
      let data = {
        document: {test: 1},
        patch: [{op: 'remove', path: '/test'}]
      };
      testRequest(app, endpoint, 'post', token, data, 200, matchResponse, done);
    });

    it.only('Replace Operation', (done) => {
      function matchResponse(res) {
        if(!(res.body.test && res.body.test === "2")) {
          throw new Error('Incorrect Information');
        }
      }
      let endpoint = '/jsonpatch';
      let data = {
        document: {test: "1"},
        patch: [{op: 'replace', path: '/test', value: "2"}]
      };
      testRequest(app, endpoint, 'post', token, data, 200, matchResponse, done);
    });

    it('Move Operation', (done) => {
      function matchResponse(res) {
        if(!(!res.body.test && res.body.test1)) {
          throw new Error('Incorrect Information');
        }
      }
      let endpoint = '/jsonpatch';
      let data = {
        document: {test: 1},
        patch: [{op: 'move', from: '/test', path: '/test1'}]
      };
      testRequest(app, endpoint, 'post', token, data, 200, matchResponse, done);
    });

    it('Copy Operation', (done) => {
      function matchResponse(res) {
        if(!res.body.test1) {
          throw new Error('Incorrect Information');
        }
      }
      let endpoint = '/jsonpatch';
      let data = {
        document: {test: 1},
        patch: [{op: 'copy', from: '/test', path: '/test1'}]
      };
      testRequest(app, endpoint, 'post', token, data, 200, matchResponse, done);
    });


    it('Operation with incorrect token', (done) => {
      function matchResponse(res) {
        if(!res.error) {
          throw new Error('Incorrect Information');
        }
      }
      let endpoint = '/jsonpatch';
      let data = {
        document: {test: 1},
        patch: [{op: 'copy', from: '/test', path: '/test1'}]
      };
      testRequest(app, endpoint, 'post', uuid(), data, 401, matchResponse, done);
    });

    it('Incorrect Operation', (done) => {
      function matchResponse(res) {
        if(!res.error) {
          throw new Error('Incorrect Information');
        }
      }
      let endpoint = '/jsonpatch';
      let data = {
        document: {test: 1},
        patch: [{op: 'incorrect', from: '/test', path: '/test1'}]
      };
      testRequest(app, endpoint, 'post', token, data, 400, matchResponse, done);
    });
  });

  describe('Thumbnail API', () => {

    it('Thumbnail API with correct data', (done) => {
      function matchResponse(res) {
        if(!res.body.data) {
          throw new Error('Incorrect Information');
        }
      }
      let endpoint = '/thumbnail';
      let data = {
        path: 'https://yt3.ggpht.com/-0zo3UN2TACg/AAAAAAAAAAI/AAAAAAAAAAA/2zANjbHjEZQ/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
      };
      testRequest(app, endpoint, 'post', token, data, 200, matchResponse, done);
    });

    it('Thumbnail API with incorrect data', (done) => {
      function matchResponse(res) {
        if(!res.error) {
          throw new Error('Incorrect Information');
        }
      }
      let endpoint = '/thumbnail';
      let data = {};
      testRequest(app, endpoint, 'post', token, data, 400, matchResponse, done);
    });

    it('Thumbnail API with incorrect path', (done) => {
      function matchResponse(res) {
        if(!res.error) {
          throw new Error('Incorrect Information');
        }
      }
      let endpoint = '/thumbnail';
      let data = {
        path: 'https://yt3.ggpht.com/-0zo3UN2TACg/dsdsd/AAAAAAAAAAA/2zANjbHjEZQ/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
      };
      testRequest(app, endpoint, 'post', token, data, 400, matchResponse, done);
    });

    it('Thumbnail API with incorrect token', (done) => {
      function matchResponse(res) {
        if(!res.error) {
          throw new Error('Incorrect Information');
        }
      }
      let endpoint = '/thumbnail';
      let data = {
        path: 'https://yt3.ggpht.com/-0zo3UN2TACg/AAAAAAAAAAI/AAAAAAAAAAA/2zANjbHjEZQ/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
      };
      testRequest(app, endpoint, 'post', uuid(), data, 401, matchResponse, done);
    });

  });
});

function testRequest(app, endpoint, method, token, body,
 responseCode, matchResponse, done)
{
  if(matchResponse == null) { matchResponse = function() {}; }
  request(app)[method](endpoint)
  .set('Authorization', token).send(body)
  .expect(responseCode)
  .expect(matchResponse)
  .end(function(err) {
    if(err) { return done(err); }
    done();
  });
};
