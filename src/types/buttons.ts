import type { AnchorHTMLAttributes, ReactNode } from "react";

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'amber' | 'outline';
  extraStyle?: string;
  href: string;
};

export type DetailsButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  extraStyle?: string;
  href: string;
};
