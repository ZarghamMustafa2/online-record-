import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';
import db from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== 'zarghammustafa@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title') || 'Untitled Document';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const id = uuidv4();
    
    // Vercel Blob Upload (Cloud Storage)
    const blob = await put(`documents/${id}-${file.name}`, file, {
      access: 'public',
    });

    const doc = {
      id,
      title,
      originalName: file.name,
      blobUrl: blob.url, // Official Vercel Blob URL
      createdAt: new Date().toISOString()
    };
    
    // Insert into Upstash Redis
    await db.insertDocument(doc);

    return NextResponse.json({ success: true, document: doc });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
