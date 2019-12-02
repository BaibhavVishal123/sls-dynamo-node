# CREATE
Create is open : Anyone can create a new record
Although, when integrating with front-end, Cors has to be enabled for particular origins

# READ
Read is closed: A customer can only see his records. And Product Names in Inventory

# UPDATE and DELETE
Update is closed: A customer can only update his record.

# Routing
An npm package 'serveless-lambda-router' is used to create a wrapper around raw NodeJs for routing purposes.


Consumer
PrimaryKey: CustomerId
SortKey: OrderId

Products:
PrimaryKey: SKUID
SortKey: ProductCategory  //composite sort keys (nested category) (hot keys)

Product  -> LSI???
