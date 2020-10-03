const faker = require('faker');

const data = [];
let status;
let price;
for (let i = 1; i < 50; i += 1) {
  status = 0;
  price = faker.random.number({ min: 100, max: 1000 });
  const title = faker.lorem.sentence();
  const categoryId = faker.random.number({ min: 1, max: 8 });
  if (categoryId === 8) {
    status = 1;
    price = faker.random.number({ min: 2000, max: 5000 });
  }
  if (status === 0) {
    price *= (-1);
  }
  const remark = faker.lorem.paragraph();
  const userId = faker.random.number({ min: 1, max: 2 });
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

module.exports = {
  up: async (queryInterface) => {
    /**
     * Add seed commands here.
     *
     * Example:

    */
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
