import type { DetailsButtonProps } from "../../types/buttons";

const DetailsButton = ({
  children,
  extraStyle = '',
  href,
  ...props
}: DetailsButtonProps) => {
  return (
    <a
      href={href}
      className={`group mt-5 text-primary/80 text-sm font-medium flex items-center cursor-pointer ${extraStyle}`}
      {...props}
    >
      <span className="group-hover:mr-2 transition-all duration-300">
        {children}
      </span>
      <span className="opacity-0 group-hover:opacity-100 transition-all duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-arrow-right h-4 w-4 inline ml-1"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </a>
  );
};

export default DetailsButton;