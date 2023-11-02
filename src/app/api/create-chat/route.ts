// /api/create-chat

import { loadPdfIntoPinecone } from '@/lib/pinecone';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log(file_key, file_name);
    await loadPdfIntoPinecone(file_key);
    return NextResponse.json({ message: 'success' });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}
