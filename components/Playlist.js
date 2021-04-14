import { useEffect, useState } from 'react'
import styles from '../styles/Playlist.module.css'

export default function Playlist({ info, onDismiss, getToken, userId }) {
  let [displayClass, setDisplayClass] = useState('');
  let [playlist, setPlaylist] = useState(info);
  
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
    fetch(`/api/clone/${info.id}`, {
      method: 'POST',
      headers: {
        Authorization: `${getToken().token_type} ${getToken().access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    })
    .then((res) => res.json())
    .then((data) => setPlaylist(data))
    .catch((err) => console.log(err));
  }

  return (
    <div className={`${styles.modal} ${displayClass}`} id="modal_fullpage_container" onClick={dismiss}>
      <div className={styles.modal_content}>
        {(Array.isArray(playlist.images) && playlist.images.length > 0) &&
          (<img className={styles.image} src={playlist.images[0].url} alt="Playlist image" width={300}/>)
        }
        {(playlist.owner.id !== userId) ?
          <a className={styles.clone_button} onClick={clone}>Make it yours!</a> :
          <p className={styles.clone_button_disabled}>It's already yours!</p>
        }
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