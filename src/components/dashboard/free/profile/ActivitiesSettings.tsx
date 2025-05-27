import { useSearchParams } from 'react-router-dom';

const ActivitiesSettings = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab'); 
    return (
        <div
            data-state={activeTab === "activities" ? "active" : "inactive"}
            role="tabpanel"
            aria-labelledby="activities-tab"
            id="activities-tab-content"
            tabIndex={0}
            className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">سجل النشاطات</h3>
                <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mx-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-primary"
                                >
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium">تسجيل الدخول</h4>
                                <p className="text-sm text-muted-foreground">
                                    تم تسجيل الدخول بنجاح
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    منذ 5 دقائق
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="flex items-start">
                            <div className="bg-primary/10 p-2 rounded-full mx-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-primary"
                                >
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium">تحديث الملف الشخصي</h4>
                                <p className="text-sm text-muted-foreground">
                                    تم تحديث معلومات الملف الشخصي
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    منذ يومين
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ActivitiesSettings