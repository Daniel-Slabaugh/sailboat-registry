exports.DATABASE_URL = process.env.MONGODB_URI ||
                      'mongodb://localhost/sailboats';
exports.TEST_DATABASE_URL = (process.env.TEST_DATABASE_URL ||
                      'mongodb://localhost/sailboats-test');
exports.PORT = process.env.PORT || 8080;