require('dotenv').config();

module.exports = {
    // Credenciais e configuração de conexão com o Banco de Dados via .env
    dialect: process.env.DIALECT ,
    host: process.env.HOST || "localhost",
    username: process.env.USERNAME ,
    password: process.env.PASSWORD ,
    database: process.env.DATABASE,
    port: process.env.DB_PORT || 3308,
    define:{
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
        
};