const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads'),
  filename:    (_, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

module.exports = multer({ storage });
