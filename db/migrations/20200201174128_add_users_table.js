
exports.up = function(knex, Promise) {
    return knex.schema.hasTable('users')
    .then(function(exists) {
        if (exists) {
            return Promise.resolve();
        }
        return knex.schema.createTable('users', function (t) {
            t.uuid('id').notNull().unique();
            t.string('username').notNull().unique();
            t.string('password').notNull();
            t.timestamps(null, true);
        });
    });
};

exports.down = function(knex) {
    return knex.schema.hasTable('users')
    .then(function(exists) {
        if (!exists) {
            return Promise.resolve();
        }
        return knex.schema.dropTable('users');
    });
};
