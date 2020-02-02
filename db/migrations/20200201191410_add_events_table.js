
exports.up = function(knex, Promise) {
    return knex.schema.hasTable('events')
    .then(function(exists) {
        if (exists) {
            return Promise.resolve();
        }
        return knex.schema.createTable('events', function (t) {
            t.uuid('id').notNull().unique();
            t.jsonb('data').notNull().unique();
            t.enu('event_type', ['USER_REGISTERED', 'USER_LOGGED_IN', 'USER_CHECKED_IN', 'USER_CHECKED_OUT']);
            t.timestamps(null, true);
        });
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.hasTable('events')
    .then(function(exists) {
        if (!exists) {
            return Promise.resolve();
        }
        return knex.schema.dropTable('events');
    });
};
