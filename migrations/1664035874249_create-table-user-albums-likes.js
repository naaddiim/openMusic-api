/* eslint-disable linebreak-style */
/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('user_albums_likes', {
        id: { type: 'VARCHAR(50)', primaryKey: true },
        user_id: { type: 'TEXT', notNull: true },
        album_id: { type: 'TEXT', notNull: true },
    })
    pgm.addConstraint('user_albums_likes', 'fk_user_albums_likes.user_id_users.id',
        `FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE`)
    pgm.addConstraint('user_albums_likes', 'fk_user_albums_likes.album_id_albums.id',
        `FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE`)
}

exports.down = (pgm) => {
    pgm.dropConstraint('user_albums_likes', 'fk_user_albums_likes.user_id_users.id')
    pgm.dropConstraint('user_albums_likes', 'fk_user_albums_likes.album_id_albums.id')
    pgm.dropTable('user_albums_likes')
}
