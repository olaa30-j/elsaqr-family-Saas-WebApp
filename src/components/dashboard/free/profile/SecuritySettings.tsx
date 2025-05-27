import { useSearchParams } from 'react-router-dom';

const SecuritySettings = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab'); 

    return (
        <div>
            <div
                data-state={activeTab === "security" ? "active" : "inactive"}
                role="tabpanel"
                aria-labelledby="security-tab"
                id="security-tab-content"
                tabIndex={0}
                className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="text-xl font-semibold mb-4">إعدادات الأمان</h3>
                    <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">تغيير كلمة المرور</h4>
                            <button className="text-sm text-primary hover:underline">
                                اضغط هنا لتغيير كلمة المرور
                            </button>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">المصادقة الثنائية</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                                تمكين المصادقة الثنائية لزيادة الأمان
                            </p>
                            <button className="text-sm text-primary hover:underline">
                                تفعيل المصادقة الثنائية
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SecuritySettings