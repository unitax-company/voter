const jwt = require("jsonwebtoken");

function TokenGenerator(secretOrPrivateKey, secretOrPublicKey, options) {
  this.secretOrPrivateKey = secretOrPrivateKey;
  this.secretOrPublicKey = secretOrPublicKey;
  this.options = options; 
}

TokenGenerator.prototype.sign = function(payload, signOptions, cb) {
  const jwtSignOptions = Object.assign({}, signOptions, this.options);
  return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions, cb);
};

TokenGenerator.prototype.refresh = function(token, refreshOptions, cb) {
  const payload = jwt.decode(token, { complete: true }).payload;
  delete payload.iat;
  delete payload.exp;
  delete payload.nbf;
  delete payload.jti;
  console.log(payload);
  return jwt.sign(payload, this.secretOrPrivateKey, this.options, cb);
};

module.exports = TokenGenerator;
