
exports.up = function(knex, Promise) {
    return knex.schema.hasTable('events')
    .then(function(exists) {
        if (exists) {
            return Promise.resolve();
        }
        return knex.schema.createTable('events', function (t) {
            t.uuid('id').notNull().unique();
            t.jsonb('data').notNull();
            t.uuid('user_id').notNull();
            t.enu('event_type', ['USER_REGISTERED', 'USER_LOGGED_IN', 'USER_CHECKED_IN', 'USER_CHECKED_OUT']);
            t.timestamps(null, true);
            t.foreign('user_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
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
