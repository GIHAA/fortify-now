const userController = require('../controllers/userController');

module.exports = async function (context, req) {
    context.log('HTTP trigger function processed a request for user login.');

    try {
        const credentials = req.body;

        if (!credentials || !credentials.username || !credentials.password) {
            throw new Error('Missing required fields:    or password.');
        }

        const token = await userController.login(credentials);

        context.res = {
            status: 200, 
            body: { token }
        };
    } catch (error) {
        context.log.error('Error during login:', error);
        context.res = {
            status: 401,
            body: { error: 'Invalid credentials' }
        };
    }
};