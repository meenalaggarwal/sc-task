import Q from 'q';

module.exports.getAccessToken = function(jwt, user, config) {
  let access_token = jwt.sign(user, config.secret, {});
  return access_token;
};

module.exports.verifyAccessToken = function(jwt, token, config) {
  let deferred = Q.defer();
  jwt.verify(token, config.secret, (err, decode) => {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve(decode);
    }
  });
  return deferred.promise;
};
