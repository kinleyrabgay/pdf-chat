'use client';
import React from 'react';
import { Inbox, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { uploadPDFToFirebase } from '@/lib/firebase';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { NextResponse } from 'next/server';
// tsrafce

const FileUpload = () => {
  const [uploading, setUploading] = React.useState(false);
  const { mutate } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const respnse = await axios.post('/api/create-chat', {
        file_key,
        file_name,
      });

      return respnse.data;
    },
  });
  const { getRootProps, getInputProps } = useDropzone({
    // Tell how to behave
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb!
        toast.error('File too large');
        return;
      }

      try {
        setUploading(true);
        const data = await uploadPDFToFirebase(file);
        if (!data?.file_key || !data?.file_name) {
          toast.error('Something went wrong');
          setUploading(false);
        }
        mutate(data, {
          onSuccess: (data) => {
            console.log(data);
            toast.success('Chat created!');
            // router.push(`/chat/${chat_id}`);
            setUploading(false);
          },
          onError: (err) => {
            toast.error('Error creating chats');
            setUploading(false);
          },
        });
      } catch (error) {
        console.log(error);
        setUploading(false);
      }
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col',
        })}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <>
            {/* loading state */}
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling Tea to GPT...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
