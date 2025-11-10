'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('posts', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'TWEET', //as linhas ja existentes serao to tipo "tweet"
    });

    
    await queryInterface.addColumn('posts', 'original_post_id', {
      type: Sequelize.INTEGER,
      allowNull: true, //um tweet normal tera esse campo como nulo
      references: { //um retweet se relaciona com um tweet; ou seja, a tabela se relaciona com si mesma
        model: 'posts', 
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE', // se o post original for deletado, os retweets também são
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('posts', 'original_post_id');
    await queryInterface.removeColumn('posts', 'type');
  }
};