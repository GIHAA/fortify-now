const userController = require('../controllers/userController');

module.exports = async function (context, req) {
    context.log('HTTP trigger function processed a request for user registration.');

    try {
        const userData = req.body;

        if (!userData || !userData.name || !userData.email || !userData.password) {
            throw new Error('Missing required fields: name, email, or password.');
        }

        const result = await userController.register(userData);

        context.res = {
            status: 201,
            body: result
        };
    } catch (error) {
        context.log.error('Error during registration:', error);
        context.res = {
            status: 400,
            body: { error: error.message }
        };
    }
};