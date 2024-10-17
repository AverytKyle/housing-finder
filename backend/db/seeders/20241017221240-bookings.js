'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: '2024-12-01',
        endDate: '2024-12-05'
      },
      {
        spotId: 2,
        userId: 1,
        startDate: '2024-11-10',
        endDate: '2024-11-15'
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete({
      startDate: { [Op.in]: ['2024-12-01', '2024-11-10'] }
    }, {});
  }
};
