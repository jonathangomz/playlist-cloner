import axios from 'axios'
import cookie from 'cookie'

export default async (req, res) => {
  const cookies = req.headers.cookie;
  
  if(!cookies) {
    return res.redirect('/');
  }

  const token = JSON.parse(cookie.parse(cookies).token);
  let response, error;
  try {
    response = await axios.get(`https://api.spotify.com/v1/search?q=${req.body.search_name}&type=playlist&limit=3`, { headers: { Authorization: `${token.token_type} ${token.access_token}` } });
  } catch(err) {
    error = err;
  }

  if(error) res.statusCode = 500;

  res.json(response?.data || error);
}
