import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Document to QR Scanner</h1>
          <p>A secure platform for uploading documents and sharing them instantly via QR Codes.</p>
          <div className={styles.actions}>
            <Link href="/admin" className={styles.primaryButton}>
              Go to Admin Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
