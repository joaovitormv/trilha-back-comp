const Sequelize = require('sequelize');
const Users = require('../models/users');
const Posts = require('../models/posts');
const Likes = require('../models/likes');

const models = [Users, Posts, Likes];

const databaseConfig = require('../configs/db');

class Database{
    constructor(){
        this.init();
    }

    init(){
        this.connection = new Sequelize(databaseConfig);

        models.map((model) => model.init(this.connection)).map((model) => {
            if (model.associate) {
              model.associate(this.connection.models);
            }
            return model;
          });
    }
}

module.exports = new Database();
