import type React from "react";
import type { TabBarProps } from "../../types/home";
import OptionLink, { options } from "../ui/OptionLink";

const MoreOptions: React.FC<TabBarProps> = () => {
    return (
        <section className="overflow-y-auto pb-16 justify-between">
            <div className="container mx-auto px-4 py-4 flex flex-col justify-between h-full">
                <div>
                    <h1 className="text-2xl font-bold mb-4">المزيد من الخيارات</h1>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {options.map((option, index) => (
                            <OptionLink key={index} {...option}/>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer className="py-4 border-t border-color-2/20 mt-2">
                    <div className="text-center text-xs text-color-2">
                        <p>© 2025 عائلة الصقر الدهمش - جميع الحقوق محفوظة</p>
                        <div className="flex justify-center gap-4 mt-1">
                            <a href="/privacy" className="hover:text-primary transition-colors">
                                سياسة الخصوصية
                            </a>
                            <a href="/terms" className="hover:text-primary transition-colors">
                                شروط الاستخدام
                            </a>
                            <a href="/contact" className="hover:text-primary transition-colors">
                                اتصل بالإدارة
                            </a>
                        </div>
                        <p className="mt-1">الإصدار 1.0.0</p>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export default MoreOptions;