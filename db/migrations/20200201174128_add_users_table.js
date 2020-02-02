
exports.up = function(knex, Promise) {
    return knex.schema.hasTable('users')
    .then(function(exists) {
        if (exists) {
            return Promise.resolve();
        }
        return knex.schema.createTable('users', function (t) {
            t.uuid('id').notNull().unique();
            t.string('username').notNull().unique();
            t.string('first_name').notNull();
            t.string('last_name').notNull();
            t.string('password').notNull();
            t.timestamps(null, true);
        });
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.hasTable('users')
    .then(function(exists) {
        if (!exists) {
            return Promise.resolve();
        }
        return knex.schema.dropTable('users');
    });
};
