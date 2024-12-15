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
      },
      {
        ownerId: 1,  // Human Persons
        address: '123 Fake Address',
        city: 'Orlando',
        state: 'FL',
        country: 'USA',
        lat: 34.0194,
        lng: -118.4912,
        name: 'The Hood',
        description: 'A place you can take the familty and visit Disney.',
        price: 500.00
      },
      {
        ownerId: 1,  // Human Persons
        address: '5421 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        lat: 34.0194,
        lng: -118.4912,
        name: 'The City',
        description: 'Experience city life in the heart of the city.',
        price: 430.00
      },
      {
        ownerId: 1,  // Human Persons
        address: '11235 Lester St',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: 34.0194,
        lng: -118.4912,
        name: 'City of Angels',
        description: 'Live with the angels in the city of angels.',
        price: 400.00
      },
      {
        ownerId: 1,  // Human Persons
        address: '12 Grove St',
        city: 'Seatle',
        state: 'WA',
        country: 'USA',
        lat: 34.0194,
        lng: -118.4912,
        name: 'Grove',
        description: 'If you like dense forrests and getting lost in the rainy weather, this is the place for you.',
        price: 250.00
      },
      {
        ownerId: 1,  // Human Persons
        address: '1546 Kansas Ave',
        city: 'Lawson',
        state: 'KS',
        country: 'USA',
        lat: 34.0194,
        lng: -118.4912,
        name: 'Cow Town',
        description: 'Visit the cow town of Kansas. There are cows everywhere.',
        price: 100.00
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete({
      name: { [Op.in]: ['Penthouse in the Sky', 'Lovely Neighborhood', 'The Hood', 'The City', 'City of Angels', 'Grove', 'Cow Town'] }
    }, {});
  }
};