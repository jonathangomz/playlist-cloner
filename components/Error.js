import { useEffect, useState } from 'react'
import styles from '../styles/Error.module.css'

export default function Error({ status }) {
  let [displayClass, setDisplayClass] = useState('');

  useEffect(() => {
    const wait = 500;
    setTimeout(() => setDisplayClass(styles.show), wait);
    setTimeout(() => setDisplayClass(styles.hide), wait * 8);
  }, []);

  return (
    <div className={`${styles.modal} ${displayClass}`}>
      {status === 404 && <p> Any playlist found with that Id </p>}
      {status === 500 && <p> An error ocurrer </p>}
    </div>
  )
}