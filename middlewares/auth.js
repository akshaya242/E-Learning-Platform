const ensureAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    return res.status(403).send('Access denied. Admins only.');
};

module.exports = { ensureAdmin };

const ensureTeacher = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'teacher') {
        return next();
    }
    return res.status(403).send('Access denied. Teachers only.');
};

module.exports = { ensureAdmin, ensureTeacher };

