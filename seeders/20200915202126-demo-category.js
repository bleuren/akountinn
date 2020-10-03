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
    await queryInterface.bulkInsert('Categories', [{
      id: 1,
      name: '食',
    },
    {
      id: 2,
      name: '衣',
    }, {
      id: 3,
      name: '住',
    }, {
      id: 4,
      name: '行',
    }, {
      id: 5,
      name: '娛樂',
    }, {
      id: 6,
      name: '投資',
    }, {
      id: 7,
      name: '其他',
    }, {
      id: 8,
      name: '收入',
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
