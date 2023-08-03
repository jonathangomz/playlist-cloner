import { useState } from 'react'
import styles from '../styles/Playlist.module.css'

export default function SearchResultItem({ info, userId }) {
  let [playlist, setPlaylist] = useState(info);
  let [loading, setLoading] = useState(false);

  const clone = () => {
    setLoading(true);
    fetch(`/api/clone/${playlist.id}`, {
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
    <div key={playlist.id} style={s_styles.search_result_item} >
      <div style={{display:'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'space-between', padding: '6px', paddingRight: '18px'}}>
        <img src={playlist.images[0].url} alt="playlist logo" width="150" height="150"/>
        {cloneButton(playlist.id, playlist.owner.id)}
      </div>
      <div style={s_styles.search_result_item_info}>
        <p style={{fontSize: '20px', fontWeight: 700,}}>
          {playlist.name}
        </p>
        <p style={{textAlign: 'justify',}}>
          {playlist.description || 'No description'}
        </p>
        <p style={{fontSize: '14px', fontWeight: 200,}}>
          By: {playlist.owner.id}
        </p>
      </div>
    </div>
  );
}

const s_styles = {
  search_result_list: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    position:'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  search_result_item: {
    display: 'flex',
    flexDirection: 'row',
    padding: '12px',
    border: '1px solid green',
    color: 'white',
  },
  search_result_item_info: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '18px',
    borderLeft: '1px solid green',
    justifyContent: 'space-between',
    width: '100%',
  },
  clone_button: {
    backgroundColor: '#37B954',
    borderRadius: '5px',
    color: 'white',
    padding: '6px',
    margin: '6px',
    width: '80%',
    textAlign: 'center',
  }
}