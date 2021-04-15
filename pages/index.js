import Head from 'next/head'
import styles from '../styles/Home.module.css'
import cookie from 'cookie'

export default function Login() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Playlist cloner
        </h1>

        <p className={styles.description}>
          To start stolen playlist first login with your Spotify account
        </p>

        <a href="/api/login" className={styles.card}>
          <h3>Login</h3>
        </a>
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

  if (cookies.token) {
    return {
      redirect: {
        destination: '/cloner',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  };
}