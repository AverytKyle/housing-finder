'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,  // Human Persons
        address: '1221 Grove St',
        city: 'Compton',
        state: 'CA',
        country: 'USA',
        lat: 34.0194,
        lng: -118.4912,
        name: 'Lovely Neighborhood',
        description: 'A beautiful condo with views.',
        price: 250.00
      },
      {
        ownerId: 2,  // Other People
        address: '456 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        lat: 39.7392,
        lng: -104.9903,
        name: 'Penthouse in the Sky',
        description: 'Lush skyline views.',
        price: 300.00
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete({
      name: { [Op.in]: ['Penthouse in the Sky', 'Lovely Neighborhood'] }
    }, {});
  }
};