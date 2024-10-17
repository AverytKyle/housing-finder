'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'human.persons@example.com',
        username: 'human_persons',
        firstName: 'Human',
        lastName: 'Persons',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'other.people@example.com',
        username: 'other_people',
        firstName: 'Other',
        lastName: 'People',
        hashedPassword: bcrypt.hashSync('password2')
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete({
      username: { [Op.in]: ['human_persons', 'other_people'] }
    }, {});
  }
};
