import { useState } from 'react';
import type { IEventInput } from '../../../../types/event';
import { toast } from 'react-toastify';

interface EventFormProps {
  initialData?: IEventInput;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const EventForm = ({ initialData, onSubmit, onCancel }: EventFormProps) => {
  console.log(initialData);

  const [formData, setFormData] = useState<IEventInput>({
    address: initialData?.address || '',
    description: initialData?.description || '',
    location: initialData?.location || 'لا يوجد',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      toast.error('فشل حفظ الحدث');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* حقل العنوان */}
      <div>
        <label className="block text-sm font-medium text-gray-700">العنوان</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* حقل الوصف */}
      <div>
        <label className="block text-sm font-medium text-gray-700">الوصف</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">الموقع</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* حقول التاريخ والوقت */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">تاريخ البدء</label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ""}
            onChange={handleChange}
            required
            className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">تاريخ الانتهاء</label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ""}
            onChange={handleChange}
            required
            className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* أزرار الإلغاء والحفظ */}
      <div className="flex justify-end pt-4 gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-primary/50"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ الحدث'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
