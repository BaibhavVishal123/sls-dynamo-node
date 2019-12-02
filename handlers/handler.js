// Error handler
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
// Router
const LambdaRouter = require('serverless-lambda-router');
const router = new LambdaRouter({
  headers: {
    'Cache-Control': 'max-age=0, private, no-cache, no-store',
    // CORS is in API g/w
    // 'Access-Control-Allow-Origin' : '*',
    // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    // 'Access-Control-Allow-Headers': 'Content-Type'
  },
  onInvoke: ({httpMethod, resource }) => {
    console.log('handler: ', httpMethod, resource);
  }/*,
  // Trigger Error fn if route fails
  onError: (err, event) => {}
  */
});

const { validateConsumer } = require('../middleware');
const modelsConsumer = require('../models/consumer');
const config = require('../config');

router.post('/consumer', async (event, context) => {
  try {
    const payload = JSON.parse(event.body);
    if (payload.name && payload.email) {
      // twice for getting result
      await modelsConsumer.createCustomer(payload);
      var result = (await modelsConsumer.createCustomer(payload)).Attributes;
      console.log("Consumer created: ", result);
      const token = jwt.sign({ CustomerId: result.CustomerId }, config.consumer.secret);
      return { result, token };
    } else {
      const err = new Error('Invalid consumer data');
      throw err;
    }
  } catch (err) {
    throw Boom.badRequest(JSON.stringify(err)+'\nInvalid Content');
  }
});

router.get('/consumer/{id}', validateConsumer(), async (event, context) => {
  try {
    const customer = context.state.customer;
    return customer;

  } catch (err) {
    throw Boom.badRequest('Invalid content.');
  }
});


router.put('/consumer/{id}', validateConsumer(), async (event, context) => {
  try {
    console.log("Starting PUT Handler");
    const payload = JSON.parse(event.body);
    if (payload.age) { 
      console.log("Data to be updated is Okay");
      var customer = {
        CustomerId: context.state.customer.CustomerId,
        age: payload.age
      };
      console.log("Strating Put Model Call: ", customer);
      var updatedData = await modelsConsumer.updatebyId(customer);
      return updatedData;
    }
    else {
      throw Boom.badRequest('Only Age Field can be updated');
    }
  } catch (err) {
    throw Boom.badRequest('Invalid content.', err);
  }
});


router.del('/consumer/{id}', validateConsumer(), async (event, context) => {
  try {    
    if (!context.state.customer) {
      throw Boom.badData("Wrong");
    }
    else {
      console.log("Going to Delete Customer with ID: ", context.state.customer);
      var deletedData = await modelsConsumer.deleteById(context.state.customer);
      return deletedData;
    }
  } catch (err) {
    throw Boom.badData("wrong", err);
  }
});

exports.handler = router.handler();