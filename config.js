module.exports = {
    consumer: {
        secret: process.env.secret  || 'AaWbfVxiFJwGQwwsz78erNshmmDfIzDeVKjx4DD9anS7oLcPvtG3tMg6HMW9kenJ',
    },
    dynamo: {
        // region: process.env.DB_HOST,
        // username: process.env.DB_USER,
        // password: process.env.DB_PASSWORD,
        // database: process.env.DB_DATABASE,
        // timeout: 10e3,
        // pool: {
        //     max: 10,
        //     min: 1,
        //     idle: 10e3
        // }
    }
};