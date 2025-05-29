export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp|JPEG|PNG|JPG)$/)) {
    return callback(new Error('Somente imagens são permitidas!'), false);
  }

  callback(null, true);
};
