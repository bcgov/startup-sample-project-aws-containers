const requireHttps = (req, res, next) => {
  // The 'x-forwarded-proto' check
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test')) {
    return res.redirect(`https://${req.get('host')}${req.url}`);
  }
  return next();
};

module.exports = requireHttps;
