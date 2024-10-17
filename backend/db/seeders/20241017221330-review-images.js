'use strict';

/** @type {import('sequelize-cli').Migration} */

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'https://example.com/condo1.jpg',
      },
      {
        reviewId: 2,
        url: 'https://example.com/condo2.jpg',
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete({
      url: { [Op.in]: ['https://example.com/condo1.jpg', 'https://example.com/condo2.jpg'] }
    }, {});
  }
};
