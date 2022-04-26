const { cloudinary } = require("../utils/cloudiary");
const streamifier = require("streamifier");
const streamUpload =async (req) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};
module.exports = { streamUpload };
