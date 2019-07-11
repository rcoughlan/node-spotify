const expect = require('chai').expect;
const api = require('../api');

let errMsg = {
    reason: "Host: api.spify.com. is not in the certs altnames: ",
    host: 'api.spify.com',
    cert: {
      subject: {
        CN: '*.convertingtraffic.com'
      },
      issuer: {
        C: 'GB',
        ST: 'Greater Manchester',
        L: 'Salford',
        O: 'COMODO CA Limited',
        CN: 'COMODO RSA Domain Validation Secure Server CA'
      }
    }
  }
 let returnedErr = new Error(`sorry, something went wrong with the host ${errMsg.host}. ${errMsg.reason}`);

 describe('api', () => {
    it('should return a formatted, redacted error message', () => {
        expect(api.getError(errMsg).message).to.equal(returnedErr.message);
    });
    
    it('should return a properly formatted path to request', () => {
        expect(api.getPath('tracks', 4, 'short_term')).to.equal(`/v1/me/top/tracks?time_range=short_term&limit=4`);
        expect(api.getPath('artists', 2, 'long_term')).to.equal(`/v1/me/top/artists?time_range=long_term&limit=2`);
        expect(api.getPath('recent', 2)).to.equal(`/v1/me/player/recently-played?limit=2`);
    });
    
    // it('should return correct error message when an incorrect auth token is parsed in', () => {
        
    // });
});