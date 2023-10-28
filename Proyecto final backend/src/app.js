import express from require('express');
import { create as exphbsCreate } from 'express-handlebars';
import session from 'express-session';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ProductManager from './ProductManager.js';
import connectDB from './db.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');


const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'API de Mi E-commerce',
      version: '1.0.0',
      description: 'Documentación de la API de Mi E-commerce',
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});




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
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    const newUser = new User({ username, password: hash });
    newUser.save((err, user) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error al registrar el usuario');
      } else {
        res.send('Usuario registrado con éxito');
      }
    });
  });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/profile', isAuthenticated, (req, res) => {
  res.send(`Bienvenido, ${req.user.username}!`);
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.use(passport.initialize());
app.use(passport.session());

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const secretKey = 'your-secret-key';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false);
      if (!user.validPassword(password)) return done(null, false);

      // Comprobar si el usuario es un administrador
      if (user.isAdmin) {
        user.role = 'admin';
      } else {
        user.role = 'usuario';
      }

      return done(null, user);
    });
  })
);
passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
  User.findById(jwtPayload.sub, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));
function authenticateJWT(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return res.sendStatus(403);
    if (!user) return res.sendStatus(401);
    next();
  })(req, res, next);
}
app.get('/current', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;


  if (userIsValid) {
    const token = jwt.sign({ sub: user._id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes'); 

app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
app.use('/purchase', purchaseRoutes); 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const { generateMockProducts } = require('./mocking');
const { handleCustomError } = require('./errorHandler');

app.get('/mockingproducts', (req, res) => {
  const mockProducts = generateMockProducts();
  res.json(mockProducts);
});

app.get('/example', (req, res, next) => {
  const isSomethingWrong = true;
  if (isSomethingWrong) {
    next(handleCustomError('INVALID_PRODUCT_DATA'));
  } else {
    res.send('Proceso exitoso');
  }
});

const { developmentLogger, productionLogger } = require('./logger');

app.get('/loggerTest', (req, res) => {
  developmentLogger.debug('Mensaje de depuración');
  developmentLogger.info('Mensaje de información');
  developmentLogger.warn('Mensaje de advertencia');
  developmentLogger.error('Mensaje de error');
  developmentLogger.fatal('Mensaje fatal');
  productionLogger.debug('Mensaje de depuración');
  productionLogger.info('Mensaje de información');
  productionLogger.warn('Mensaje de advertencia');
  productionLogger.error('Mensaje de error');
  productionLogger.fatal('Mensaje fatal');

  res.send('Logs generados. Verifique la consola o el archivo de registro.');
});


const userRouter = require('./routes/userRouter');
app.use('/api/users', userRouter);


