'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (session?.user?.email === "zarghammustafa@gmail.com") {
      fetch('/api/documents')
        .then(res => res.json())
        .then(data => {
          if(data.documents) setDocuments(data.documents);
        });
    }
  }, [session]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { document } = await res.json();
        setDocuments([document, ...documents]);
        setFile(null);
        setTitle("");
        if(fileInputRef.current) fileInputRef.current.value = "";
        alert("Document uploaded successfully!");
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  if (status === "loading") {
    return <div className={styles.container}><div className={styles.spinner}></div></div>;
  }

  if (!session || session.user.email !== "zarghammustafa@gmail.com") {
    return (
      <div className={styles.container}>
        <div className={styles.glassCard}>
          <h1>Admin Access Only</h1>
          <p>Please log in with the admin password to manage documents.</p>
          <button className={styles.button} onClick={() => signIn()}>Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <div className={styles.userControls}>
          <span>{session.user.name}</span>
          <button className={styles.outlineButton} onClick={() => signOut()}>Sign Out</button>
        </div>
      </header>
      
      <main className={styles.main}>
        <form onSubmit={handleUpload} className={styles.uploadCard}>
          <h2>Upload New Document</h2>
          <div className={styles.inputGroup}>
            <label>Document Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Report 2026" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Select File</label>
            <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} required />
          </div>
          <button className={styles.button} type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload & Generate QR"}
          </button>
        </form>

        <div className={styles.docsList}>
          <h2>Your Documents</h2>
          {documents.length === 0 && <p>No documents uploaded yet.</p>}
          <div className={styles.grid}>
            {documents.map((doc) => (
              <div key={doc.id} className={styles.docCard}>
                <h3>{doc.title}</h3>
                <p className={styles.meta}>Created: {new Date(doc.createdAt).toLocaleDateString()}</p>
                <QRGenerator url={`${typeof window !== 'undefined' ? window.location.origin : ''}/doc/${doc.id}`} />
                <div className={styles.links}>
                  <a href={`/doc/${doc.id}`} target="_blank" rel="noreferrer" className={styles.linkButton}>Open Landing Page</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function QRGenerator({ url }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    QRCode.toDataURL(url, { width: 150, margin: 2, color: { dark: "#000", light: "#fff" } }).then(setSrc);
  }, [url]);
  return src ? (
    <div className={styles.qrWrapper}>
      <img src={src} alt="QR" className={styles.qrImage} />
    </div>
  ) : null;
}
