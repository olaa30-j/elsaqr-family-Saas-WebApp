import { useState, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({
  value = '',
  onChange = () => {},
  placeholder = 'اكتب هنا...',
  className = ''
}: RichTextEditorProps) => {
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'ordered',
    'link',
    'color', 'background'
  ];

  const handleChange = (newContent: string) => {
    setContent(newContent);
    onChange(newContent);
  };

  return (
    <div className={className}>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;