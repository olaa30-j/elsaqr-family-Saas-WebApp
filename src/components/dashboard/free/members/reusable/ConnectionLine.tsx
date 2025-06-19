interface ConnectionLineProps {
  type: 'parent' | 'sibling' | 'spouse';
  position?: 'first' | 'last' | 'middle';
  className?: string;
}

export const ConnectionLine = ({ type, position, className = '' }: ConnectionLineProps) => {
  const baseClass = "absolute pointer-events-none border-gray-400";

  if (type === 'parent') {
    return (
      <div className={`${baseClass} top-0 left-1/2 w-0 h-6 border-l-2 border-dashed transform -translate-x-1/2 ${className}`} />
    );
  }

  if (type === 'spouse') {
    return (
      <div className={`${baseClass} bottom-0 left-1/2 w-0 h-10 border-l-2 border-dashed transform -translate-x-1/2 ${className}`} />
    );
  }

  if (type === 'sibling') {
    return (
      <>
        <div className={`${baseClass} top-0 left-1/2 w-0 h-6 border-l-2 border-dashed transform -translate-x-1/2 ${className}`} />
        <div className={`${baseClass} top-0 h-0 border-t-2 border-dashed ${
          position === 'first' ? 'right-1/2 left-0' :
          position === 'last' ? 'right-0 left-1/2' :
          'left-0 right-0'
        } ${className}`} />
      </>
    );
  }

  return null;
};