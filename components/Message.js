import { useEffect, useState } from 'react'
import styles from '../styles/Message.module.css'

export default function Message({ message }) {
  let [displayClass, setDisplayClass] = useState('');

  useEffect(() => {
    const wait = 500;
    setTimeout(() => setDisplayClass(styles.show), wait);
    setTimeout(() => setDisplayClass(styles.hide), wait * 8);
  }, []);

  return (
    <div className={`${styles.modal} ${displayClass}`}>
      {message}
    </div>
  )
}