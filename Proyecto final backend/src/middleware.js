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