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
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/1642125/pexels-photo-1642125.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/2157404/pexels-photo-2157404.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/1475938/pexels-photo-1475938.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/1575939/pexels-photo-1575939.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/250659/pexels-photo-250659.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://images.pexels.com/photos/772177/pexels-photo-772177.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://images.pexels.com/photos/111963/pexels-photo-111963.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://images.pexels.com/photos/161768/lafayette-park-washington-dc-c-architecture-161768.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://images.pexels.com/photos/314937/pexels-photo-314937.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://images.pexels.com/photos/672916/pexels-photo-672916.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://images.pexels.com/photos/783682/pexels-photo-783682.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://images.pexels.com/photos/1438834/pexels-photo-1438834.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://images.pexels.com/photos/542403/pexels-photo-542403.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://images.pexels.com/photos/1559825/pexels-photo-1559825.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://images.pexels.com/photos/1131863/pexels-photo-1131863.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://images.pexels.com/photos/586687/pexels-photo-586687.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://images.pexels.com/photos/2816323/pexels-photo-2816323.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://images.pexels.com/photos/2886284/pexels-photo-2886284.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete({
      url: {
        [Op.in]: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1642125/pexels-photo-1642125.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/2157404/pexels-photo-2157404.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1475938/pexels-photo-1475938.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1575939/pexels-photo-1575939.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/250659/pexels-photo-250659.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/542403/pexels-photo-542403.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1559825/pexels-photo-1559825.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1131863/pexels-photo-1131863.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/586687/pexels-photo-586687.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/2816323/pexels-photo-2816323.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/2886284/pexels-photo-2886284.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=600',
        ]
      }
    }, {});
  }
};
