import axios from 'axios'

export default async (req, res) => {
  // Get the tracks
  const res_tracks = await axios.get(`https://api.spotify.com/v1/playlists/${req.query.playlistId}/tracks`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  const tracks = res_tracks.data;
  const tracks_to_be_added = [];
  for (const track of tracks.items) {
    tracks_to_be_added.push(track.track.uri);
  }

  // Create the new playlist
  const res_new_playlist = await axios.post(`https://api.spotify.com/v1/users/${req.body.userId}/playlists`, { name: `Copy of ${req.query.playlistId}`}, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  const id = res_new_playlist.data.id;

  // Add the tracks to the playlist
  await axios.post(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
    uris: tracks_to_be_added,
  }, {
    headers: {
      Authorization: req.headers.authorization,
    }
  });

  // Get the last info of the created playlist
  const res_playlist = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  res.json(res_playlist.data);
}
