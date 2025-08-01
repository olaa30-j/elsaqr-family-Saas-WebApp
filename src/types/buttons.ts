import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonLinkProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'amber' | 'outline';
  extraStyle?: string;
  buttonLink: string;
  disabled?:boolean
};

export type DetailsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  extraStyle?: string;
  buttonLink: string;
};
