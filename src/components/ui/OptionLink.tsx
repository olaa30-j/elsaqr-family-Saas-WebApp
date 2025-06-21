import React from "react";
import type { OptionLinkProps } from "../../types/home";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../../hooks/usePermission";
import { PERMISSION_POINTS } from "../../utils/permissions";
import { useGetAuthUserQuery } from "../../store/api/baseApi";

type PermissionKey = keyof typeof PERMISSION_POINTS;

interface ProtectedOptionLinkProps extends OptionLinkProps {
  requiredPermission?: PermissionKey | PermissionKey[];
}

const OptionLink: React.FC<ProtectedOptionLinkProps> = ({
  href,
  title,
  icon,
  bgColor = "bg-card",
  borderColor = "border-border",
  hoverColor = "hover:bg-color-2/20",
  setShowMoreOptions,
  requiredPermission
}) => {
  const navigate = useNavigate();
  const { isSuccess } = useGetAuthUserQuery();

  const handleNavigation = (path: string) => {
    if (!isSuccess) {
      navigate('/login', { state: { from: path } });
      return;
    }

    navigate(path);
    if (setShowMoreOptions) {
      setShowMoreOptions();
    }
  };

  if (!requiredPermission) {
    return (
      <button
        onClick={() => handleNavigation(href)}
        className="w-full focus:outline-none"
      >
        <div className={`rounded-lg text-card-foreground shadow-sm transition-colors cursor-pointer border ${bgColor} ${borderColor} ${hoverColor}`}>
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-2">{icon}</div>
            <span className="font-medium">{title}</span>
          </div>
        </div>
      </button>
    );
  }

  // إذا كانت الصلاحية قيمة مفردة
  if (!Array.isArray(requiredPermission)) {
    const { hasPermission } = usePermission(requiredPermission);
    if (!hasPermission) return null;

    return (
      <button
        onClick={() => handleNavigation(href)}
        className="w-full focus:outline-none"
      >
        <div className={`rounded-lg text-card-foreground shadow-sm transition-colors cursor-pointer border ${bgColor} ${borderColor} ${hoverColor}`}>
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-2">{icon}</div>
            <span className="font-medium">{title}</span>
          </div>
        </div>
      </button>
    );
  }

  // إذا كانت الصلاحية مصفوفة
  const permissionChecks = requiredPermission.map(permission => {
    const { hasPermission } = usePermission(permission);
    return hasPermission;
  });

  if (!permissionChecks.some(check => check)) {
    return null;
  }

  return (
    <button
      onClick={() => handleNavigation(href)}
      className="w-full focus:outline-none"
    >
      <div className={`rounded-lg text-card-foreground shadow-sm transition-colors cursor-pointer border ${bgColor} ${borderColor} ${hoverColor}`}>
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <div className="mb-2">{icon}</div>
          <span className="font-medium">{title}</span>
        </div>
      </div>
    </button>
  );
};

// أيقونات الخيارات
export const FileLinesIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5 text-primary" viewBox="0 0 384 512">
    <path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
  </svg>
);

export const SupportIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5 text-blue-600" viewBox="0 0 512 512">
    <path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
  </svg>
);

export const UserIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5 text-primary" viewBox="0 0 448 512">
    <path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
  </svg>
);

export const GearIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5 text-purple-600" viewBox="0 0 512 512">
    <path fill="currentColor" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4 24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
  </svg>
);

export const ShieldIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5 text-purple-600" viewBox="0 0 512 512">
    <path fill="currentColor" d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8l0 378.1C394 378 431.1 230.1 432 141.4L256 66.8s0 0 0 0z" />
  </svg>
);

export const BellIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5 text-purple-600" viewBox="0 0 448 512">
    <path fill="currentColor" d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
  </svg>
);

export const MoneyBillIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5 text-green-600" viewBox="0 0 576 512">
    <path fill="currentColor" d="M0 112.5L0 422.3c0 18 10.1 35 27 41.3c87 32.5 174 10.3 261-11.9c79.8-20.3 159.6-40.7 239.3-18.9c23 6.3 48.7-9.5 48.7-33.4l0-309.9c0-18-10.1-35-27-41.3C462 15.9 375 38.1 288 60.3C208.2 80.6 128.4 100.9 48.7 79.1C25.6 72.8 0 88.6 0 112.5zM288 352c-44.2 0-80-43-80-96s35.8-96 80-96s80 43 80 96s-35.8 96-80 96zM64 352c35.3 0 64 28.7 64 64l-64 0 0-64zm64-208c0 35.3-28.7 64-64 64l0-64 64 0zM512 304l0 64-64 0c0-35.3 28.7-64 64-64zM448 96l64 0 0 64c-35.3 0-64-28.7-64-64z" />
  </svg>
);

export const CalendarDaysIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5 text-blue-600" viewBox="0 0 448 512">
    <path fill="currentColor" d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48H0l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z" />
  </svg>
);

// قائمة الخيارات الافتراضية
export const options: ProtectedOptionLinkProps[] = [
  {
    href: "/profile",
    title: "الملف الشخصي",
    icon: <UserIcon />,
    bgColor: "bg-card",
    borderColor: "border-border",
    hoverColor: "hover:bg-color-2/20",
    requiredPermission: ["USER_VIEW"]
  },
  {
    href: "/contact-us",
    title: "الدعم الفني",
    icon: <SupportIcon />,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverColor: "hover:bg-blue-100"
  },
  {
    href: "/admin/dashboard",
    title: "لوحة الإدارة",
    icon: <GearIcon />,
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    hoverColor: "hover:bg-purple-100",
    requiredPermission: ["MEMBER_CREATE", "MEMBER_EDIT", "MEMBER_DELETE"]
  },
  {
    href: "/admin/roles-permissions",
    title: "الأدوار والصلاحيات",
    icon: <ShieldIcon />,
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    hoverColor: "hover:bg-purple-100",
    requiredPermission: ["MEMBER_CREATE", "MEMBER_EDIT", "MEMBER_DELETE"]
  },
  {
    href: "/financial",
    title: "اللجنة المالية",
    icon: <MoneyBillIcon />,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    hoverColor: "hover:bg-green-100",
    requiredPermission: ["FINANCIAL_CREATE", "FINANCIAL_EDIT", "FINANCIAL_DELETE"]
  },
  {
    href: "/events",
    title: "اللجنة الاجتماعية",
    icon: <CalendarDaysIcon />,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverColor: "hover:bg-blue-100",
    requiredPermission: ["EVENT_CREATE", "EVENT_EDIT", "EVENT_DELETE"]
  }
];

export default OptionLink;