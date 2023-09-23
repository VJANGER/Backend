export const renderLogin = (req, res) => {
    res.render('login');
  };
  
  export const renderRegister = (req, res) => {
    res.render('register');
  };
  
  export const renderProfile = (req, res) => {
    const user = req.session.user;
    res.render('profile', { user });
  };
  