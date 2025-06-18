import DOMPurify from 'dompurify';
import React from 'react';

interface RichTextRendererProps {
  content: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  className = '',
  allowedTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'div', 'span',
    'strong', 'b', 'em', 'i', 'u', 's',
    'ul', 'ol', 'li',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ],
  allowedAttributes = [
    'style', 'class', 'dir',
    'href', 'target', 'rel',
    'src', 'alt', 'width', 'height'
  ]
}) => {
  const cleanContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    FORCE_BODY: true
  });

  return (
    <div 
      className={`rich-text-content ${className}`}
      dir="auto"
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  );
};

export default RichTextRenderer;