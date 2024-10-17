'use strict';

/** @type {import('sequelize-cli').Migration} */

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://example.com/condo1.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://example.com/condo2.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://example.com/penthouse1.jpg',
        preview: true
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete({
      url: { [Op.in]: ['https://example.com/condo1.jpg', 'https://example.com/condo2.jpg', 'https://example.com/penthouse1.jpg'] }
    }, {});
  }
};
