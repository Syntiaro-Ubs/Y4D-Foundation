import React from 'react';
import DOMPurify from 'dompurify';

/**
 * SanitizedHTML Component
 * Safely renders HTML content by sanitizing it to prevent XSS attacks
 * 
 * @param {string} content - HTML content to sanitize and render
 * @param {object} className - Optional CSS class name
 * @param {object} allowedTags - Custom allowed HTML tags (optional)
 */
const SanitizedHTML = ({ content, className = '', allowedTags = null }) => {
  if (!content) return null;

  // Default allowed tags - safe HTML elements
  const defaultAllowedTags = [
    'p', 'br', 'strong', 'em', 'u', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'span', 'div',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img'
  ];

  // Default allowed attributes
  const defaultAllowedAttrs = ['href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'class', 'id'];

  const config = {
    ALLOWED_TAGS: allowedTags || defaultAllowedTags,
    ALLOWED_ATTR: defaultAllowedAttrs,
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: true,
    // Prevent script execution
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onkeyup', 'onkeydown', 'oninput', 'onfocus', 'onblur', 'onsubmit', 'onreset', 'onchange', 'onselect', 'onabort']
  };

  const sanitized = DOMPurify.sanitize(content, config);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }} 
    />
  );
};

export default SanitizedHTML;

