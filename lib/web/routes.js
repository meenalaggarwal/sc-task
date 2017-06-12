import jsonpatch from 'json-patch';
import jimp from 'jimp';
import log4js from 'log4js';

let log = log4js.getLogger("users");

module.exports.applyJsonPatch = function applyJsonPatch(req, res, next) {
  log.info("Entering json patch route");
  jsonpatch.apply(req.body.document, req.body.patch);
  res.send(req.body.document);
};

module.exports.createThumbnail = function createThumbnail(req, res, next) {
  log.info("Entering creating thumbnail route");
  jimp.read(req.body.path, (err, image) => {
    if (err) {
      next(err);
    } else {
      log.info("Read source path successfully");
      image.resize(50, 50, (err, data) => {
        if (err) {
          next(err);
        } else {
          res.send(data.bitmap);
        }
      });
    }
  });
};
