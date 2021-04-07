import cookie from 'cookie';

export default async (req, res) => {
  res.setHeader('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_END === 'production',
    expires: new Date(0),
    sameSite: 'strict',
    path: '/',
  }));

  res.redirect('/');
}
