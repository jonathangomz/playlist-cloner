import axios from 'axios'

export default async (req, res) => {
  let response, error;
  try {
    response = await axios.get(`https://api.spotify.com/v1/playlists/${req.query.playlistId}`, { headers: { Authorization: req.headers.authorization } });
  } catch(err) {
    error = err;
  }

  if(error) res.statusCode = 404;

  res.json(response?.data || error);
}
