const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { scryptSync } = require('crypto');
const { dbClient, collections } = require('./db');

const jwtSecret = process.env.JWT_SECRET || 'secret'; // FIXME: Obviously not secure
const passwordSalt = process.env.PASSWORD_SALT || 'salt'; // FIXME: Obviously not secure

const USER_TYPE_PHAC = 'phac';

// Hash and salt password (static + dynamic salt)
const hashPassword = (password, salt) => (
  scryptSync(password, `${passwordSalt}${salt}`, 64).toString('hex')
);

// Create JWT for admin user or PDF generation
// PDF JWTs should only have access to form with ID matchin sub property
const generateJwt = (id, type) => jwt.sign({
  sub: id,
  type,
}, jwtSecret, { expiresIn: type === USER_TYPE_PHAC ? '4h' : '24h' });

// Fetch user item from credentials table of DB
// Returns user item (username and password)
// Could be refactored into database.js
const getUser = async (username) => {
  const usersCollection = dbClient.db.collection(collections.USERS);
  return usersCollection.findOne({ username: { $in: [username] } });
};

// Login method with username and password in POST request
// Creates JWT and sets as user.token
passport.use('login', new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await getUser(username);
      if (user && user.salt && user.password !== hashPassword(password, user.salt)) {
        return done(null, false); // Incorrect password
      }
      user.token = generateJwt(username, user.type);
      return done(null, user); // Success
    } catch (error) {
      return done(null, false); // Invalid user ID
    }
  },
));

const strategyOpt = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

// JWT auth methods using Bearer token

// General SSP endpoints strategy (for users without specific type)
passport.use('jwt', new JwtStrategy(strategyOpt,
  async (payload, done) => {
    if (!payload.type) {
      done(null, { id: payload.sub, type: null }); // Success
    } else {
      done(null, false); // Invalid user type
    }
  }));

// PHAC strategy for phac endpoint only (only users with type === 'phac' can access)
passport.use('jwt-phac', new JwtStrategy(strategyOpt,
  async (payload, done) => {
    if (payload.type === USER_TYPE_PHAC) {
      done(null, { id: payload.sub, type: payload.type }); // Success
    } else {
      done(null, false); // Invalid user type
    }
  }));

module.exports = { passport, hashPassword };
