const checkRole = (roleRequired) => {
    return (req, res, next) => {
        const role = req.headers['x-user-role'];
        if (role === roleRequired) {
            next();
        } else {
            res.status(403).json({ message: `Akses ditolak. Butuh role: ${roleRequired}` });
        }
    };
};

module.exports = checkRole;