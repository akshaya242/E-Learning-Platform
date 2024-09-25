const ensureAdmin = (user, res, next) => {
    if (user.role === 'admin') {
        return next();
    }
    return res.status(403).send('Access denied. Admins only.');
};

module.exports = { ensureAdmin };
