/* eslint-disable no-param-reassign */
const faker = require('faker');

module.exports = {
  up: async (queryInterface) => {
    /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
    const data = [];
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
    );

    if (users[0].length % 2 !== 0) {
      console.log(`You must have an even number of names. You currently have ${users[0].length} names.`);
    } else {
      const arr1 = users[0].slice();
      const arr2 = users[0].slice();

      arr1.sort(() => 0.5 - Math.random());
      arr2.sort(() => 0.5 - Math.random());

      while (arr1.length) {
        const user1 = arr1.pop();
        const user2 = arr2[0] === user1 ? arr2.pop() : arr2.shift();
        const createdAt = new Date();
        const updatedAt = new Date();
        const owner = user1.id;
        const member = user2.id;
        data.push({
          name: faker.lorem.sentence(),
          owner,
          member,
          createdAt,
          updatedAt,
        });
      }
    }
    await queryInterface.bulkInsert('Teams', data, {});
  },

  down: async (queryInterface) => {
    /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    await queryInterface.bulkDelete('Teams', null, {});
  },
};
