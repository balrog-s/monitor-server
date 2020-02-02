
exports.up = function(knex) {
    return knex.raw(`
        CREATE VIEW IF NOT EXISTS status_events AS (
            select id, data->>"id" as user_id, event_type, created_at, updated_at FROM events order by created_at desc
        );
    `);
};

exports.down = function(knex) {
    return knex.raw(`DROP VIEW IF EXISTS status_events;`);
};
