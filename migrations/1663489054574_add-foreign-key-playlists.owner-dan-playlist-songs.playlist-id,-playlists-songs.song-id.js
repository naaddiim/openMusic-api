/* eslint-disable linebreak-style */
/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', `FOREIGN KEY(owner) 
    REFERENCES users(id) ON DELETE CASCADE`)
    pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id', `FOREIGN KEY(playlist_id) 
    REFERENCES playlists(id) ON DELETE CASCADE`)
    pgm.addConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id', `FOREIGN KEY(song_id) 
    REFERENCES songs(id) ON DELETE CASCADE`)
    pgm.addConstraint('playlist_songs', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)')
}

exports.down = (pgm) => {
    pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id')
    pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id')
    pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id')
    pgm.dropConstraint('playlist_songs', 'unique_playlist_id_and_song_id')
}
