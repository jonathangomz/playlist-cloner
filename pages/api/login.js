export default (req, res) => {
  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.CALLBACK}&scope=playlist-modify-public%20playlist-modify-private`);
}
