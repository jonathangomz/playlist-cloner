export default function SearchResult({ playlists }) {
  return (
    <div style={styles.search_result_list}>
      {playlists.map((playlist) => (
        <div key={playlist.id} style={styles.search_result_item} >
          <div style={{display:'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'space-between', padding: '6px', paddingRight: '18px'}}>
            <img src={playlist.images[0].url} alt="playlist logo" width="150" height="150"/>
            <a style={styles.clone_button}>Clone it!</a>
          </div>
          <div style={styles.search_result_item_info}>
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
      ))}
    </div>
  );
}

const styles = {
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