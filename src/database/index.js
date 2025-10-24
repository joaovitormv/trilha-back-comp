const Sequelize = require('sequelize');
const Users = require('../models/users');
const models = [Users];
const databaseConfig = require('../configs/db');

class Database{
    constructor(){
        this.init();
    }

    init(){
        this.connection = new Sequelize(databaseConfig);

        models.map((model) => model.init(this.connection));
    }
}

module.exports = new Database();
