import Head from 'next/head'
import styles from '../styles/Home.module.css'
import cloner from '../styles/Cloner.module.css'
import playlist from '../styles/Playlist.module.css'
import error from '../styles/Error.module.css'
import cookie from 'cookie'
import { useEffect, useState } from 'react'

export default function Cloner({ token }) {
  const [searchResults, setSearchResults] = useState(undefined);
  const [playlist, setPlaylist] = useState(undefined);
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
        
        {playlist &&
          <Playlist
            id={playlist.id}
            name={playlist.name}
            description={playlist.description}
            owner={playlist.owner}
            tracks={playlist.tracks}
            href={playlist.external_urls.spotify}
            uri={playlist.uri}
            images={playlist.images}
            onDismiss={() => setPlaylist(undefined)}
            getToken={() => token}
          />
        }

        {loading && <span>Is loading</span>}

        {error && <Error status={error.status} />}
      </main>

      <footer className={styles.footer}>

        <a
          href="https://jonathangomz/codes"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by <span style={{ fontWeight: 700, padding: '5px' }}>@jonathangomz</span>
        </a>
      </footer>
    </div>
  );
}

function Error({ status }) {
  let [displayClass, setDisplayClass] = useState('');

  useEffect(() => {
    const wait = 500;
    setTimeout(() => setDisplayClass(error.show), wait);
    setTimeout(() => setDisplayClass(error.hide), wait * 8);
  }, []);

  return (
    <div className={`${error.modal} ${displayClass}`}>
      {status === 404 && <p> Any playlist found with that Id </p>}
      {status === 500 && <p> An error ocurrer </p>}
    </div>
  )
}

function Playlist({ id, name, description, owner, uri, href, tracks, images, onDismiss, getToken }) {
  let [displayClass, setDisplayClass] = useState('');
  
  useEffect(() => {
    setDisplayClass(playlist.modal_show);
  }, []);

  const dismiss = (e) => {
    if(e.target.id === 'modal_fullpage_container') {
      setDisplayClass(playlist.modal_hide);
      setTimeout(() => onDismiss(), 1000);
    }
  }

  const clone = () => {
    fetch(`/api/clone/${id}`, {
      headers: {
        Authorization: `${getToken().token_type} ${getToken().token}`
      }
    })
  }

  return (
    <div className={`${playlist.modal} ${displayClass}`} id="modal_fullpage_container" onClick={dismiss}>
      <div className={playlist.modal_content}>
        {(Array.isArray(images) && images.length > 0) &&
          (<img className={playlist.image} src={images[0].url} alt="Playlist image" width={300}/>)
        }
        <a className={playlist.clone_button} onClick={clone}>Make it yours</a>
        <h3 style={{ marginBottom: 0 }}>{ name }</h3>
        <p style={{ marginBottom: '12px', fontSize: '14px', textAlign: 'justify', fontStyle: 'italic' }}>{ description }</p>
        <div className={playlist.playlist_field}>
          <p>Author:</p>
          <p>{ owner.display_name }</p>
        </div>
        <div className={playlist.playlist_field}>
          <p>Num. tracks:</p>
          <p>{ tracks.total }</p>
        </div>
        <div className={playlist.buttons_container}>
          <span style={{ fontWeight: 700 }}>Open</span>
          <div className={playlist.buttons_list}>
            <a className={playlist.button} href={`https://open.spotify.com/go?uri=${uri}&rtd=1`} target="_blank">App</a>
            <a className={playlist.button} href={href} target="_blank">Browser</a>
          </div>
        </div>
      </div>
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