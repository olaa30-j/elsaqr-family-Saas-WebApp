import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChangePasswordForm from './ChangePasswordForm';

const SecuritySettings = () => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab');
    const [showPasswordForm, setShowPasswordForm] = useState(false); 

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
                            {!showPasswordForm ? (
                                <button
                                    onClick={() => setShowPasswordForm(true)}
                                    className="text-sm text-primary hover:underline"
                                >
                                    اضغط هنا لتغيير كلمة المرور
                                </button>
                            ) : (
                                <ChangePasswordForm onCancel={() => setShowPasswordForm(false)} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SecuritySettings