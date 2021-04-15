import { useEffect, useState } from 'react'
import styles from '../styles/Playlist.module.css'

export default function Playlist({ info, onDismiss, userId }) {
  let [displayClass, setDisplayClass] = useState('');
  let [playlist, setPlaylist] = useState(info);
  let [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setDisplayClass(styles.modal_show);
  }, []);

  const dismiss = (e) => {
    if(e.target.id === 'modal_fullpage_container') {
      setDisplayClass(styles.modal_hide);
      setTimeout(() => onDismiss(), 1000);
    }
  }

  const clone = () => {
    setLoading(true);
    fetch(`/api/clone/${info.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    })
    .then((res) => res.json())
    .then((data) => setPlaylist(data))
    .catch((err) => console.log(err))
    .finally(() => setLoading(false));
  }
  
  const cloneButton = () => {
    if(playlist.owner.id === userId) // The playlist is of the current user
      return (
        <p className={[styles.clone_button, styles.clone_button_disabled].join(" ")}>It's already yours!</p>
      );
    else if(loading) // The playlist is being cloning
      return (
        <a className={[styles.clone_button, styles.clone_button_loading].join(" ")}>
          <svg className={styles.loading} width="20" height="20" viewBox="0 0 287 287" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M271 143.5C271 213.916 213.916 271 143.5 271C73.0838 271 16.0001 213.916 16.0001 143.5C16.0001 73.0836 73.0838 15.9999 143.5 15.9999" stroke="black" strokeWidth="32"/>
          </svg>
        </a>
      );
    else // Can clone
      return (
        <a className={styles.clone_button} onClick={clone}>Make it yours!</a>
      );
  }
  
  return (
    <div className={`${styles.modal} ${displayClass}`} id="modal_fullpage_container" onClick={dismiss}>
      <div className={styles.modal_content}>
        {(Array.isArray(playlist.images) && playlist.images.length > 0) &&
          (<img className={styles.image} src={playlist.images[0].url} alt="Playlist image" width={300}/>)
        }

        {cloneButton()}
        
        <h3 style={{ marginBottom: 0 }}>{ playlist.name }</h3>
        <p style={{ marginBottom: '12px', fontSize: '14px', textAlign: 'justify', fontStyle: 'italic' }}>{ playlist.description }</p>
        <div className={styles.playlist_field}>
          <p>Author:</p>
          <p>{ playlist.owner.display_name }</p>
        </div>
        <div className={styles.playlist_field}>
          <p>Num. tracks:</p>
          <p>{ playlist.tracks.total }</p>
        </div>
        <div className={styles.buttons_container}>
          <span style={{ fontWeight: 700 }}>Open</span>
          <div className={styles.buttons_list}>
            <a className={styles.button} href={`https://open.spotify.com/go?uri=${playlist.uri}&rtd=1`} target="_blank">App</a>
            <a className={styles.button} href={playlist.external_urls.spotify} target="_blank">Browser</a>
          </div>
        </div>
      </div>
    </div>
  );
}