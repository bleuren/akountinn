const bcrypt = require('bcrypt');
const faker = require('faker');

const saltRounds = 10;
const password = bcrypt.hashSync('0000', saltRounds);

module.exports = {
  up: async (queryInterface) => {
    const data = [];
    for (let i = 1; i <= 10; i += 1) {
      const username = faker.internet.userName();
      const createdAt = new Date();
      const updatedAt = new Date();
      data.push({
        username,
        password,
        createdAt,
        updatedAt,
      });
    }
    await queryInterface.bulkInsert('Users', data, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
