'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: 'Amazing spot, beautiful views!',
        stars: 5
      },
      {
        spotId: 1,
        userId: 3,
        review: 'Great spot, beautiful house!',
        stars: 4
      },
      {
        spotId: 2,
        userId: 1,
        review: 'Cozy condo, perfect for a getaway.',
        stars: 4
      },
      {
        spotId: 2,
        userId: 3,
        review: 'Great spot, beautiful house!',
        stars: 4
      },
      {
        spotId: 3,
        userId: 2,
        review: 'Amazing spot, beautiful views!',
        stars: 4
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Great spot, beautiful house!',
        stars: 4
      },
      {
        spotId: 4,
        userId: 1,
        review: 'Cozy condo, perfect for a getaway.',
        stars: 3
      },
      {
        spotId: 4,
        userId: 3,
        review: 'Great spot, beautiful house!',
        stars: 4
      },
      {
        spotId: 5,
        userId: 2,
        review: 'Amazing spot, beautiful views!',
        stars: 5
      },
      {
        spotId: 5,
        userId: 3,
        review: 'Great spot, beautiful house!',
        stars: 5
      },
      {
        spotId: 6,
        userId: 1,
        review: 'Cozy condo, perfect for a getaway.',
        stars: 4
      },
      {
        spotId: 6,
        userId: 3,
        review: 'Great spot, beautiful house!',
        stars: 4
      },
      {
        spotId: 7,
        userId: 2,
        review: 'Amazing spot, beautiful views!',
        stars: 3
      },
      {
        spotId: 7,
        userId: 3,
        review: 'Great spot, beautiful house!',
        stars: 4
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete({
      review: { [Op.in]: ['Amazing spot, beautiful views!', 'Cozy condo, perfect for a getaway.'] }
    }, {});
  }
};
