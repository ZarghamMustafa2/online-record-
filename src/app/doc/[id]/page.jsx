import db from '@/lib/db';
import { notFound } from 'next/navigation';
import styles from './doc.module.css';

export default async function DocumentPage({ params }) {
  const { id } = await params;
  
  const doc = await db.getDocumentById(id);
  if (!doc) {
    notFound();
  }

  // Pure Cloud URL
  const fileUrl = doc.blobUrl;
  const filename = doc.originalName || "Document";
  const isImage = filename.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPdf = filename.match(/\.pdf$/i);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>{doc.title}</h1>
          <p className={styles.date}>Uploaded on {new Date(doc.createdAt).toLocaleDateString()}</p>
        </div>

        <div className={styles.viewerContainer}>
          {isImage ? (
            <img src={fileUrl} alt={doc.title} className={styles.previewImage} />
          ) : isPdf ? (
            <object data={fileUrl} type="application/pdf" className={styles.previewPdf}>
              <p>Your browser does not support PDFs. <a href={fileUrl}>Download the PDF</a>.</p>
            </object>
          ) : (
            <div className={styles.fallbackPreview}>
              <p>Preview not available for this file type.</p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <a href={fileUrl} download={doc.originalName || doc.filename} className={styles.downloadButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download Document
          </a>
        </div>
      </main>
    </div>
  );
}
