import multer from 'multer';
import path from 'path';

// Konfiguracja multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/books'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('File upload only supports the following filetypes - ' + filetypes));
  },
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});

export default upload;
