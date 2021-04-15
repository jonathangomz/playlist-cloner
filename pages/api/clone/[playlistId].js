import axios from 'axios'
import cookie from 'cookie'

export default async (req, res) => {
  const cookies = req.headers.cookie;
  
  if(!cookies) {
    return res.redirect('/');
  }

  const token = JSON.parse(cookie.parse(cookies).token);

  // Get the tracks
  const res_tracks = await axios.get(`https://api.spotify.com/v1/playlists/${req.query.playlistId}/tracks`, {
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`
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
      Authorization: `${token.token_type} ${token.access_token}`
    }
  });

  const id = res_new_playlist.data.id;

  // Add the tracks to the playlist
  await axios.post(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
    uris: tracks_to_be_added,
  }, {
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`,
    }
  });

  // Get the last info of the created playlist
  const res_playlist = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`
    }
  });

  res.json(res_playlist.data);
}
