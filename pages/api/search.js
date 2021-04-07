import axios from 'axios'

export default async (req, res) => {
  let response, error;
  try {
    response = await axios.get(`https://api.spotify.com/v1/search?q=${req.body.search_name}&type=playlist&limit=5`, { headers: { Authorization: req.headers.authorization } });
  } catch(err) {
    console.log(err);
    error = err;
  }

  if(error) res.statusCode = 500;

  res.json(response?.data || error);
}
