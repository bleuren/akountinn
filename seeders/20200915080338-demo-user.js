const bcrypt = require('bcrypt');

const saltRounds = 10;
const password = '0000';
const hash = bcrypt.hashSync(password, saltRounds);

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Users', [{
      username: 'bleuren',
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      username: 'nita',
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
