import type { ButtonLinkProps } from "../../types/buttons";

const Button = ({ children, variant = 'primary', extraStyle = '', ...props }: ButtonLinkProps) => {
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-gray-800 hover:bg-secondary/80',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    amber: 'bg-amber-600 text-white hover:bg-amber-600/90',
    outline:''
  };

  return (
    <a
      className={`
        inline-flex items-center justify-center gap-2
        whitespace-nowrap font-medium
        ring-offset-background transition-colors
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-ring focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50
        [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
        h-11 rounded-lg px-8 py-6 text-lg
        ${variantClasses[variant]}
        ${extraStyle}
      `}
      {...props}
    >
      {children}
    </a>
  );
};

export default Button;