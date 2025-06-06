import { Bell, BookOpen, LayoutDashboard, Shield, Users, BarChart4, Eye, UserCheck2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
const menuItems = [
    {
        icon: <LayoutDashboard className="h-5 w-5" />,
        title: "لوحة التحكم",
        description: "نظرة عامة على أداء التطبيق والإحصائيات",
        path: "/admin/dashboard",
        active: false
    },
    {
        icon: <Users className="h-5 w-5" />,
        title: "المستخدمون",
        description: "إدارة جميع حسابات المستخدمين",
        path: "/admin/users",
        active: false
    },
    {
        icon: <Shield className="h-5 w-5" />,
        title: "الأدوار والصلاحيات",
        description: "تنظيم صلاحيات المستخدمين والأدوار",
        path: "/admin/roles-permissions",
        active: true
    },
    {
        icon: <BookOpen className="h-5 w-5" />,
        title: "أقسام التطبيق",
        description: "تفعيل وتعطيل أقسام التطبيق",
        path: "/admin/sections",
        active: false
    },
    {
        icon: <UserCheck2 className="h-5 w-5" />,
        title: "سجلات الأعضاء",
        description: "مراقبة وإدارة الأعضاء في التطبيق",
        path: "/admin/members",
        active: false
    },
    {
        icon: <Bell className="h-5 w-5" />,
        title: "إدارة الإشعارات",
        description: "إرسال وإدارة إشعارات النظام",
        path: "/admin/notifications",
        active: false
    },
    {
        icon: <BarChart4 className="h-5 w-5" />,
        title: "الإحصائيات",
        description: "تحليلات واحصائيات استخدام التطبيق",
        path: "/admin/statistics",
        active: false
    },
    // {
    //     icon: <Settings className="h-5 w-5" />,
    //     title: "إعدادات النظام",
    //     description: "تعديل الإعدادات العامة للتطبيق",
    //     path: "/admin/settings",
    //     active: false
    // }
];
const ControlPanelSidebar = () => {
    const { pathname } = useLocation();

    return (
        <aside className="min-h-sceen overflow-y-auto bg-white rounded-lg shadow-sm border px-4 flex flex-col">
            {/* العنوان */}
            <div className="text-xl font-bold font-heading my-3 text-primary pr-2 text-center font-cairo">
                عائلة الصقر الدهمش
            </div>
            <div className="text-xl font-bold font-heading mb-6 text-gray-700 pr-2 text-center">
                لوحة التحكم
            </div>
            <nav className='className="flex-1 overflow-y-auto"'>
                <ul className="space-y-2">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <Link to={item.path}>
                                <div
                                    className={`flex items-center p-3 rounded-md transition-colors hover:bg-muted cursor-pointer 
                                        ${pathname.includes(item.path)
                                            ? "bg-primary/10 text-primary font-medium"
                                            : ""
                                        }`}
                                >
                                    <span className="ml-3">{item.icon}</span>
                                    <div className="text-right">
                                        <div>{item.title}</div>
                                        <div className="text-xs text-muted-foreground line-clamp-1">
                                            {item.description}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto border-t pt-4">
                <Link to={"/dashboard"}>
                    <div className="flex items-center p-3 rounded-md text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                        <Eye className="h-5 w-5 ml-3" />
                        <span>العودة للتطبيق</span>
                    </div>
                </Link>
            </div>
        </aside >
    )
}

export default ControlPanelSidebar