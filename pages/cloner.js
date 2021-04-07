import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import cloner from '../styles/Cloner.module.css'
import cookie from 'cookie'
import { useEffect, useState } from 'react'

export default function Cloner({ token }) {
  const [playlist, setPlaylist] = useState(undefined);
  const [playlistIdInput, setPlaylistIdInput] = useState('');
  const [playlistId, setPlaylistId] = useState('');

  useEffect(() => {
    if(playlistId) {
      fetch(`/api/playlists/${playlistId}`, {
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`,
          'Content-Type': 'application/json',
        }
      })
      .then((res) => res.json())
      .then((data) => setPlaylist(data));
    }
  }, [playlistId]);

  console.log(playlist);

  return (
    <div className={styles.container}>
      <Head>
        <title>Logged!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <a href="/api/logout" className={cloner.logout_button}>Logout</a>

        <h1 className={styles.title}>
          Playlist cloner
        </h1>

        <input className={cloner.search_bar} type="text" placeholder="playlist_id" onChange={(e) => setPlaylistIdInput(e.target.value)}/>
        <button className={cloner.search_button} onClick={() => setPlaylistId(playlistIdInput)}>Search</button>
        
        {playlist && (<img src={playlist.images[1].url} alt="Playlist mosaic" width={playlist.images[1].width}/>)}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const cookies = cookie.parse(req ? req.headers.cookie || '' : document.cookie);

  if (!cookies.token) {
    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
  }

  return {
    props: {
      token: cookies.token ? JSON.parse(cookies.token) : ''
    }
  }

}