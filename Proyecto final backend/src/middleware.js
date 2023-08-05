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
  