
exports.up = function(knex) {
    return knex.raw(`
        CREATE OR REPLACE VIEW users_history AS (
            select events.id, username, first_name, last_name, event_type, events.created_at, events.updated_at FROM events inner join users on (data->>'id')::uuid = users.id order by events.created_at desc
        );
    `);
};

exports.down = function(knex) {
    return knex.raw(`DROP VIEW IF EXISTS users_history;`);
};
