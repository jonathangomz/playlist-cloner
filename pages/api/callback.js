import axios from 'axios';
import qs from 'querystring';
import cookie from 'cookie';

async function getToken(code) {
  let response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.CALLBACK,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response?.data;
}

export default async (req, res) => {
  const token = await getToken(req.query.code);

  res.setHeader('Set-Cookie', cookie.serialize('token', JSON.stringify(token), {
    httpOnly: true,
    secure: process.env.NODE_END === 'production',
    maxAge: token.expires_in,
    sameSite: 'strict',
    path: '/',
  }));

  res.redirect('/');
}
