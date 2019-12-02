const AWS = require('aws-sdk');
var uuid = require('node-uuid');
const Boom = require('@hapi/boom');

var uuid5 = uuid.v4();
AWS.config = new AWS.Config({
    region: 'us-east-1'
});

var dynamoDocClient = new AWS.DynamoDB.DocumentClient();

class Consumer {

    // customerId is primary key  and partition key
    async findById(customerId, table = "customer", filterList = []) {
        var params = {
            TableName: table,
            Key: {
                "CustomerId": customerId
            },
            "ReturnValues": "ALL_OLD"
        };
        if (filterList.length != 0) {
            params.AttributesToGet = filterList;
        }
        return new Promise( (resolve, reject) => {
            dynamoDocClient.get(params, function (err, data) {
                if (err) return reject(err);
                else {
                    if (!data.Item) {
                        return reject("empty");
                        //throw Boom.resourceGone("Empty");
                    }
                    return resolve(data.Item);
                }
            });
        });
    }
    
    async createCustomer(customer, table = "customer") {
        return new Promise( async (resolve, reject) => {
            var params = {
                TableName: table,
                Item: {
                    "CustomerId": uuid5,
                },
                "ReturnValues": "ALL_OLD"
            };
            if (customer.name) {
                params.Item.name = customer.name; //{"firstName": fn, "lastName": lN}
            }
            if (customer.email) {
                params.Item.email = customer.email;
            }
            dynamoDocClient.put(params, function (err, data) {
                if (err) {
                    reject(err);
                } 
                else {
                    resolve(data);
                }
            });    
        });
        
    }

    async updatebyId(customer, table = "customer") {
        return new Promise((resolve, reject) => {
            try {
                var params = {
                    TableName: table,
                    Key: {
                        "CustomerId": customer.CustomerId
                    },
                    AttributeUpdates: {
                        "Age": {
                            Action: "PUT",
                            Value: customer.age
                        }
                    },
                    "ReturnValues": "UPDATED_NEW"
                };
                dynamoDocClient.update(params, function (err, data) {
                    if (err) reject(err);
                    else {
                        resolve(data);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    async deleteById(customer, table = "customer") {
        var params = {
            TableName: table,
            Key: {
                "CustomerId": customer.CustomerId
            },
            "ReturnValues": "ALL_OLD"
        };
        return new Promise((resolve, reject) => {
            dynamoDocClient.delete(params, function (err, data) {
                if (err) reject(err);
                else {
                    return resolve();
                }
            });
         });
        
    }
}

module.exports = new Consumer();
