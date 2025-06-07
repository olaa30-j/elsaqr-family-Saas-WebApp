import { useState } from 'react';
import { useChangePasswordMutation } from '../../../../store/api/authApi';

const ChangePasswordForm = ({ onCancel }: { onCancel: () => void }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await changePassword({ oldPassword, newPassword }).unwrap();
            onCancel(); // إغلاق النموذج بعد النجاح
        } catch (error) {
            console.error('Failed to change password:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium mb-1">
                    كلمة المرور الحالية
                </label>
                <input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                    كلمة المرور الجديدة
                </label>
                <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                    {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                    إلغاء
                </button>
            </div>
        </form>
    );
}

export default ChangePasswordForm;