import Head from 'next/head'
import dynamic from 'next/dynamic'
import styles from '../styles/Home.module.css'
import cloner from '../styles/Cloner.module.css'
import cookie from 'cookie'
import { useEffect, useState } from 'react'

const Error = dynamic(() => import('../components/Error'))
const Message = dynamic(() => import('../components/Message'))
const Playlist = dynamic(() => import('../components/Playlist'))
const SearchResult = dynamic(() => import('../components/SearchResult'))

export default function Cloner({ token }) {
  const [searchResults, setSearchResults] = useState(undefined);
  const [playlist, setPlaylist] = useState(undefined);
  const [profile, setProfile] = useState(undefined);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);

  function resetSearchState() {
    setSearchResults(undefined);
    setPlaylist(undefined);
    setError(undefined);
    setLoading(false);
  }

  function search() {
    resetSearchState();

    if(searchText) {
      setLoading(true);

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
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
    }
  };

  function searchById() {
    resetSearchState();

    if(searchText) {
      setLoading(true);

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
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetch('/api/me', {
      headers: {
        Authorization: `${token.token_type} ${token.access_token}`,
      }
    })
    .then((res) => res.ok ? res.json() : res)
    .then((data) => {
      if(data?.status && data?.status !== 200) {
        setError(data);
      }else {
        setProfile(data);
      }
    })
    .catch((err) => console.log(err));
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Playlist Cloner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {profile && (
          <Message message={`You are logged in as ${profile.display_name}`} />
        )}

        <a href="/api/logout" className={cloner.logout_button}>Logout</a>

        <h1 className={styles.title}>
          Playlist cloner
        </h1>

        <input className={cloner.search_bar} type="text" placeholder="playlist_id or playlist_name" onChange={(e) => setSearchText(e.target.value)}/>
        <div className={cloner.search_buttons_container}>
          <button className={cloner.search_button} onClick={search}>Search by name</button>
          <button className={cloner.search_button} onClick={searchById}>Search by id</button>
        </div>
        
        {(playlist && profile) &&
          <Playlist
            info={playlist}
            userId={profile.id}
            onDismiss={() => setPlaylist(undefined)}
            getToken={() => token}
          />
        }

        {(searchResults && searchResults?.items?.length > 0) && <SearchResult playlists={searchResults.playlists.items}/>}

        {loading && <span>Is loading</span>}

        {error && <Error status={error.status} />}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://jonathangomz.codes"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by <span style={{ fontWeight: 700, padding: '5px' }}>@jonathangomz</span>
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