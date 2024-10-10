module.exports = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5432,
    dbFile: process.env.DB_FILE,
    jwtConfig: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN
    }
};