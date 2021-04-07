import Head from 'next/head'
import styles from '../styles/Home.module.css'
import cloner from '../styles/Cloner.module.css'
import error from '../styles/Cloner.module.css'
import cookie from 'cookie'
import { useState } from 'react'

export default function Cloner({ token }) {
  const [searchResults, setSearchResults] = useState(undefined);
  const [playlist, setPlaylist] = useState(undefined);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState(undefined);

  function resetSearchState() {
    setError(undefined);
    setPlaylist(undefined);
    setSearchResults(undefined);
  }

  function search() {
    resetSearchState();

    if(searchText) {
      fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({ search_name: searchText }),
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`,
          'Content-Type': 'application/json',
        }
      })
      .then((res) => res.ok ? res.json() : res)
      .then((data) => {
        if(data?.status && data?.status !== 200) {
          setError(data);
        }else {
          setSearchResults(data);
        }
      })
      .catch((err) => console.log(err));
    }
  };

  function searchById() {
    resetSearchState();

    if(searchText) {
      fetch(`/api/playlists/${searchText}`, {
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`,
        }
      })
      .then((res) => res.ok ? res.json() : res)
      .then((data) => {
        if(data?.status && data?.status !== 200) {
          setError(data);
        }else {
          setPlaylist(data);
        }
      })
      .catch((err) => console.log(err));
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Playlist Cloner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <a href="/api/logout" className={cloner.logout_button}>Logout</a>

        <h1 className={styles.title}>
          Playlist cloner
        </h1>

        <input className={cloner.search_bar} type="text" placeholder="playlist_id or playlist_name" onChange={(e) => setSearchText(e.target.value)}/>
        <div className={cloner.search_buttons_container}>
          <button className={cloner.search_button} onClick={search}>Search by name</button>
          <button className={cloner.search_button} onClick={searchById}>Search by id</button>
        </div>
        
        {playlist && <Playlist images={playlist.images}/>}

        {error && <Error status={error.status} />}
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

function Error({ status }) {
  return (
    <div className={error.modal}>
      {status === 404 && <p> Any playlist found with that Id </p>}
      {status === 500 && <p> An error ocurrer </p>}
    </div>
  )
}

function Playlist({ images }) {
  return (
    <div>
      {(Array.isArray(images) && images.length > 0) &&
        (<img src={images[0].url} alt="Playlist image" width={300}/>)
      }
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