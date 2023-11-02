// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import {
  getBytes,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDvshPheSOqsQCp2uo1yqZyDnO532OmyN4',
  authDomain: 'infointeractai.firebaseapp.com',
  projectId: 'infointeractai',
  storageBucket: 'infointeractai.appspot.com',
  messagingSenderId: '422859166020',
  appId: '1:422859166020:web:f15ab48686983ad696c711',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the Firebase Storage bucket
const db = getFirestore(app);

// Get a non-default Storage bucket
const firebaseApp = getApp();
const storage = getStorage(firebaseApp, 'gs://infointeractai.appspot.com');

function generateRandomFileKey(fileName: string) {
  const key = Math.random().toString(36).substring(7);
  return `${key}-${fileName}`;
}

export async function uploadPDFToFirebase(pdfBuffer: any) {
  try {
    const bucket = ref(storage, 'pdfs');
    const fileKey = generateRandomFileKey(pdfBuffer.path);
    const fileRef = ref(bucket, fileKey);
    await uploadBytes(fileRef, pdfBuffer);
    const downloadURL = await getDownloadURL(fileRef);

    console.log(
      `Uploaded PDF file "${pdfBuffer.path}" with key "${fileKey}" to Firebase Cloud Storage.`
    );

    return {
      file_key: fileKey,
      file_name: pdfBuffer.path,
      download_url: downloadURL,
    };
  } catch (error) {
    console.error('Error uploading PDF file to Firebase Cloud Storage:', error);
    throw error;
  }
}

export async function getPDFFromFirebase(fileKey: any) {
  try {
    const bucket = ref(storage, 'pdfs');
    const fileRef = ref(bucket, fileKey);
    const pdfBytes = await getBytes(fileRef);
    return pdfBytes;
  } catch (error) {
    console.error('Error getting PDF file from Firebase Cloud Storage:', error);
    throw error;
  }
}
