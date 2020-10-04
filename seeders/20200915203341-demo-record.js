const faker = require('faker');

module.exports = {
  up: async (queryInterface) => {
    /**
     * Add seed commands here.
     *
     * Example:

    */
    const data = [];

    const categories = await queryInterface.sequelize.query(
      'SELECT id from "Categories";',
    );
    const income = await queryInterface.sequelize.query(
      'SELECT * from "Categories" WHERE name = \'收入\';',
    );
    const users = await queryInterface.sequelize.query(
      'SELECT id from "Users";',
    );
    let status;
    let price;
    for (let i = 1; i < 50; i += 1) {
      status = 0;
      price = faker.random.number({ min: 100, max: 1000 });
      const cIndex = faker.random.number({ min: 0, max: categories[0].length - 1 });
      const title = faker.lorem.sentence();
      const categoryId = categories[0][cIndex].id;
      if (categoryId === income[0][0].id) {
        status = 1;
        price = faker.random.number({ min: 2000, max: 5000 });
      }
      if (status === 0) {
        price *= (-1);
      }
      const remark = faker.lorem.paragraph();
      const userId = users[0][faker.random.number({ min: 0, max: 1 })].id;
      const createdAt = faker.date.between('2019-01-01', '2020-01-01');
      const txAt = createdAt;
      const updatedAt = createdAt;
      data.push({
        title,
        categoryId,
        status,
        price,
        remark,
        userId,
        txAt,
        createdAt,
        updatedAt,
      });
    }
    await queryInterface.bulkInsert('Records', data, {});
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Records', null, {});
  },
};
