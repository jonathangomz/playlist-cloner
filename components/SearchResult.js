import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import styles from '../styles/SearchResult.module.css'

const SearchResultItem = dynamic(() => import('../components/SearchResultItem'))

export default function SearchResult({ playlists, userId, onDismiss }) {
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

  return (
    <div className={`${styles.modal} ${displayClass}`} id="modal_fullpage_container" onClick={dismiss}>
      <div className={styles.modal_content}>
        <div style={s_styles.search_result_list}>
          {playlists.map((playlist) => (
            <SearchResultItem
              info={playlist}
              userId={userId}
            />
          ))}
        </div>
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
  }
}