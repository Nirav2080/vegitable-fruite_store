
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Skeleton } from '../ui/skeleton';

const ReactQuill = dynamic(() => import('react-quill'), { 
    ssr: false,
    loading: () => <Skeleton className="h-[200px] w-full rounded-md" />
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link'],
    ['clean']
  ],
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  return (
      <div className="bg-background rounded-md border border-input">
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            className='[&_.ql-editor]:min-h-[200px]'
        />
      </div>
  );
}
