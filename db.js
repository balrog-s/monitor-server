var knex = require('knex');

let connection;

if (process.env.NODE_ENV === 'production') {
    connection = knex({
        client: 'pg',
        connection: process.env.DATABASE_URL
    });
} else {
    connection = knex({
        client: 'pg',
        connection: process.env.DATABASE_URL
    });
}

module.exports = connection;