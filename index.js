var smartcrop = require('smartcrop');
var gm = require('gm');

gm = gm.subClass({ imageMagick: true });

var iop = {
  open: function(src) {
    return new Promise(function(resolve, reject) {
      var _gm = gm(src);
      _gm.size(function(err, size) {
        if (err) return reject(err);
        resolve({
          width: size.width,
          height: size.height,
          _gm: _gm
        });
      });
    });
  },
  resample: function(image, width, height) {
    return Promise.resolve({
      width: ~~width,
      height: ~~height,
      _gm: image._gm,
    });
  },
  getData: function(image) {
    return new Promise(function(resolve, reject) {
      image._gm
      .resize(image.width, image.height, '!')
      .toBuffer('RGBA', function(err, buffer) {
        if (err) return reject(err);
        resolve(new smartcrop.ImgData(image.width, image.height, buffer));
      });
    });
  },
};

exports.crop = function(img, options, callback) {
  options = options || {};
  options.imageOperations = iop;
  return smartcrop.crop(img, options, callback);
};
