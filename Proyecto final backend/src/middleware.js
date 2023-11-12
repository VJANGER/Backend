const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.fieldname === 'profileImage' ? 'profiles' : 'products';
    cb(null, `uploads/${fileType}`);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;


export const requireAuth = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    next();
  };

  export const requireNoAuth = (req, res, next) => {
    if (req.session.user) {
      return res.redirect('/profile');
    }
    next();
  };

  function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }

  app.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
  });