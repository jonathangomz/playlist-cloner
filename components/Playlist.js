import { useEffect, useState } from 'react'
import styles from '../styles/Playlist.module.css'

export default function Playlist({ id, name, description, owner, uri, href, tracks, images, onDismiss, getToken }) {
  let [displayClass, setDisplayClass] = useState('');
  
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
    fetch(`/api/clone/${id}`, {
      headers: {
        Authorization: `${getToken().token_type} ${getToken().token}`
      }
    })
  }

  return (
    <div className={`${styles.modal} ${displayClass}`} id="modal_fullpage_container" onClick={dismiss}>
      <div className={styles.modal_content}>
        {(Array.isArray(images) && images.length > 0) &&
          (<img className={styles.image} src={images[0].url} alt="Playlist image" width={300}/>)
        }
        <a className={styles.clone_button} onClick={clone}>Make it yours</a>
        <h3 style={{ marginBottom: 0 }}>{ name }</h3>
        <p style={{ marginBottom: '12px', fontSize: '14px', textAlign: 'justify', fontStyle: 'italic' }}>{ description }</p>
        <div className={styles.playlist_field}>
          <p>Author:</p>
          <p>{ owner.display_name }</p>
        </div>
        <div className={styles.playlist_field}>
          <p>Num. tracks:</p>
          <p>{ tracks.total }</p>
        </div>
        <div className={styles.buttons_container}>
          <span style={{ fontWeight: 700 }}>Open</span>
          <div className={styles.buttons_list}>
            <a className={styles.button} href={`https://open.spotify.com/go?uri=${uri}&rtd=1`} target="_blank">App</a>
            <a className={styles.button} href={href} target="_blank">Browser</a>
          </div>
        </div>
      </div>
    </div>
  );
}