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

    await queryInterface.bulkInsert('Categories', [
      {
        name: '食',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '衣',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        name: '住',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        name: '行',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        name: '娛樂',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        name: '投資',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        name: '收入',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        name: '其他',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface) => {
    /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
