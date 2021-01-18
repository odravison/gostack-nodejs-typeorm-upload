import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

const tempDir = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpDir: tempDir,
  storage: multer.diskStorage({
    destination: tempDir,
    filename: (request, file, callback) => {
      const filehash = crypto.randomBytes(10).toString('hex');
      const fileName = `${filehash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
