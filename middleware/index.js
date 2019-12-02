const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');

const config = require('../config');
const modelsConsumer = require('../models/consumer');

/**
 * Read / validate consumer.
 * If successful, consumer will be added to context.state.
 * @param {Boolean} shouldThrow
 * @returns {Function}
 */
exports.validateConsumer = (shouldThrow = true) => {
    return async (event, context) => {
        const token = event.headers.Authorization;
        const id = event.headers.userid;

        if (!token) {
            if (shouldThrow) throw Boom.unauthorized('Access denied 1.');
            return;
        }

        try {
            console.log("Reached Middleware");
            const consumer = jwt.verify(token, config.consumer.secret);
            if (id != consumer.CustomerId) {
                throw Boom.unauthorized("Mismatch Token");
            }
            if (consumer && consumer.CustomerId) {
                console.log("Middleware starting to verify");
                const customer = await modelsConsumer.findById(consumer.CustomerId);
                console.log("customer: ", customer);
                context.state.customer = customer;
                return;
            }
        } catch (err) {
            if (shouldThrow) throw Boom.unauthorized('Access denied 2.');
        }
        if (shouldThrow) throw Boom.unauthorized('Access denied 3.');
    };
};