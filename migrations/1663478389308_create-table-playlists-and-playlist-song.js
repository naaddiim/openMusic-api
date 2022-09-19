/* eslint-disable linebreak-style */
/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('playlists', {
        id: { type: 'VARCHAR(50)', primaryKey: true },
        name: { type: 'TEXT', notNull: true },
        owner: { type: 'TEXT', notNull: true },
    })
    pgm.createTable('playlist_songs', {
        id: { type: 'VARCHAR(50)', primaryKey: true },
        playlist_id: { type: 'TEXT', notNull: true },
        song_id: { type: 'TEXT', notNull: true },
    })
};

exports.down = (pgm) => {
    pgm.dropTable('playlists')
    pgm.dropTable('playlist_songs')
};
