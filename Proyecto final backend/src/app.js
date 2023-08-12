import express from 'express';
import { create as exphbsCreate } from 'express-handlebars';
import session from 'express-session';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ProductManager from './ProductManager.js';
import connectDB from './db.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

connectDB();

const productManager = new ProductManager('products.json');

const exphbs = exphbsCreate();

app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  const products = productManager.getProducts();
  res.render('index', { products });
});

app.post('/products', (req, res) => {
  try {
    const productId = productManager.addProduct(req.body);
    const products = productManager.getProducts();
    io.emit('productsUpdated', products);
    res.redirect('/');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    productManager.deleteProduct(productId);
    const products = productManager.getProducts();
    io.emit('productsUpdated', products);
    res.redirect('/');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');
});

server.listen(8080, () => {
  console.log('Server running on port 8080');
});
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false, { message: 'Incorrect email' });
    }

    if (!await bcrypt.compare(password, user.password)) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });

    if (!user) {
      user = await User.create({
        githubId: profile.id,
        username: profile.username
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

app.use(passport.initialize());
app.use(passport.session());