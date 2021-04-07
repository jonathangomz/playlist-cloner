import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import cloner from '../styles/Cloner.module.css'
import cookie from 'cookie'

export default function Cloner({ token }) {
  const router = useRouter();

  function logout() {
    fetch('/api/logout', {
      method: 'POST'
    }).then(() => {
      router.replace('/');
    });
  }

  function test() {
    console.log(token);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Logged!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Playlist cloner
        </h1>

        <input className={cloner.search_bar} type="text" placeholder="playlist_id"/>
        <button className={cloner.search_button} onClick={test}>Search</button>
        <a href="/api/logout" className={cloner.logout_button}>Logout</a>
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

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req ? req.headers.cookie || '' : document.cookie);

  console.log(cookies);

  return {
    props: {
      token: cookies.token ? JSON.parse(cookies.token) : ''
    }
  }

}