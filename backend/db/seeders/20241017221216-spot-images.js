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
        url: 'https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://cdn.pixabay.com/photo/2013/10/09/02/27/lake-192990_1280.jpg',
        preview: true
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete({
      url: { [Op.in]: ['https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg', 'https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg', 'https://cdn.pixabay.com/photo/2013/10/09/02/27/lake-192990_1280.jpg'] }
    }, {});
  }
};
