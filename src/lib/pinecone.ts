import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { getPDFFromFirebase } from './firebase';
// import { downloadFromS3 } from './s3-server';
// import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
// import md5 from 'md5';
// import {
//   Document,
//   RecursiveCharacterTextSplitter,
// } from '@pinecone-database/doc-splitter';
// import { getEmbeddings } from './embeddings';
// import { convertToAscii } from './utils';

export const getPineconeClient = () => {
  return new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadPdfIntoPinecone(file_key: string) {
  console.log('Downloading pdf into system');
  const file_name = await getPDFFromFirebase(file_key);
}
