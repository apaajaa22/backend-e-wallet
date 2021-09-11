# ExpressJS - Backend_E-Wallet RESTfull API

## About
CRUD database for:
1. User
2. Product
3. Auth
4. Transactions
5. Top Up

## Built With
[![Express.js  v4.17.1](https://img.shields.io/badge/Express%20-v4.17.1-brightgreen.svg?style=flat)](https://expressjs.com/)
[![Node.js v14.17.3](https://img.shields.io/badge/Node%20-v14.17.3-blue.svg?style=flat)](https://nodejs.org/en/)



## Requirements
1. [NodeJs](https://nodejs.org/en/)
2. Node_modules
3. [Postman](https://www.getpostman.com/)
4. Web Server (ex. localhost)

## How to run the app ?

1. Open app's directory in CMD or Terminal
2. Type npm install
3. Make new file a called .env, set up first
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name #nama_database, and Import file sql to phpmyadmin
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:3000/)
8. You can see all the end point [here](https://documenter.getpostman.com/view/4158274/U16kqjx6)

## Set up .env file
Open .env file on your favorite code editor, and copy paste this code below :

```
NODE_ENV=development
PORT=8080
APP_URL=http://localhost:8080
APP_KEY=superSecret!
APP_UPLOAD_ROUTE=/uploads
APP_UPLOAD_PATH=assets/images
APP_TRANSACTION_PREFIX=CS
DB_HOST=localhost
DB_NAME=coffeeshop_dev
DB_USER=root
DB_PASS
```

## License
© [Rahadian Reza R](https://github.com/apaajaa22)
