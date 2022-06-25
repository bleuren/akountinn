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
      'SELECT id FROM categories;',
    );
    const income = await queryInterface.sequelize.query(
      'SELECT * FROM categories WHERE name = \'收入\';',
    );
    const teams = await queryInterface.sequelize.query(
      'SELECT id,owner,member FROM teams;',
    );
    let status;
    let price;
    for (let i = 1; i < 1000; i += 1) {
      status = 0;
      price = faker.datatype.number({ min: 100, max: 1000 });
      const cIndex = faker.datatype.number({ min: 0, max: categories[0].length - 1 });
      const title = faker.lorem.sentence();
      const categoryId = categories[0][cIndex].id;
      if (categoryId === income[0][0].id) {
        status = 1;
        price = faker.datatype.number({ min: 2000, max: 5000 });
      }
      if (status === 0) {
        price *= (-1);
      }
      const remark = faker.lorem.paragraph();
      const teamIndex = faker.datatype.number({ min: 0, max: teams[0].length - 1 });
      const team = [teams[0][teamIndex].owner, teams[0][teamIndex].member];
      const userId = team[faker.datatype.number(1)];
      const teamId = teams[0][teamIndex].id;
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
        teamId,
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
