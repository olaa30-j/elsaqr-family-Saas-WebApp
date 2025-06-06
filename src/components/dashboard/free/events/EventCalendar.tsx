import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import type { IEvent } from '../../../../types/event';
import { toast } from 'react-toastify';
import { Edit, Plus, Trash2, ChevronUp, ChevronDown, CalendarDaysIcon } from 'lucide-react';
import EventForm from './EventForm';
import {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation
} from '../../../../store/api/eventApi';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer, slideIn } from '../../../../utils/motion';
import Modal from '../../../ui/Modal';
import { ar } from 'date-fns/locale';

const EventCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);
  const [deletingEvent, setdeletingEvent] = useState<IEvent | null>(null);
  const [isDeleteEvent, setIsDeleteEvent] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof IEvent; direction: 'asc' | 'desc' }>({
    key: 'startDate',
    direction: 'asc'
  });
  const [activeTab, setActiveTab] = useState<'calendar' | 'table'>('calendar');

  const {
    data: apiResponse = { data: [], pagination: {} },
    isError,
    error: apiError,
    refetch
  } = useGetEventsQuery({});

  // فرز جميع الأحداث
  const sortedEvents = useMemo(() => {
    const sortableItems = [...apiResponse.data];
    if (sortConfig) {
      sortableItems.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [apiResponse.data, sortConfig]);

  const events = sortedEvents;

  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  // طلب الفرز
  const requestSort = (key: keyof IEvent) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // الحصول على أيام الشهر الحالي
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // تصفية الأحداث للتاريخ المحدد
  const selectedEvents = selectedDate
    ? events.filter(event => isSameDay(new Date(event.startDate), selectedDate))
    : [];

  // إرسال النموذج
  const handleSubmit = async (eventData: any) => {
    try {
      if (editingEvent) {
        await updateEvent({
          id: editingEvent._id,
          updates: eventData
        }).unwrap();
        toast.success('تم تحديث الحدث بنجاح!');
      } else {
        await createEvent(eventData).unwrap();
        toast.success('تم إنشاء الحدث بنجاح!');
      }
      setShowForm(false);
      setEditingEvent(null);
      refetch();
    } catch (err) {
      toast.error('فشل في حفظ الحدث');
      console.error(err);
    }
  };

  // حذف الحدث
  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id).unwrap();
      toast.success('تم حذف الحدث بنجاح!');
      refetch();
    } catch (err) {
      toast.error('فشل في حذف الحدث');
    }
  };

  // التنقل بين الأشهر
  const prevMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  if (isError) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-red-500 text-center py-8"
    >
      خطأ: {JSON.stringify(apiError)}
    </motion.div>
  );

  return (
    <section>
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer(0.1, 0.2)}
        className="container mx-auto p-4"
      >
        {/* رأس الصفحة مع التبويبات */}
        <motion.div
          variants={fadeIn('down', 'spring', 0.2, 0.5)}
          className="flex flex-col gap-8 md:flex-row justify-between items-center mb-6"
        >
          <h1 className="text-2xl font-bold text-primary-600 flex gap-2 text-primary items-center">
            <CalendarDaysIcon className='w-5 h-5' />
            نظام إدارة الأحداث
          </h1>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 rounded transition-all ${activeTab === 'calendar' ? 'bg-primary text-white shadow-md' : 'bg-white border-2 border-primary text-primary'}`}
            >
              عرض التقويم
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('table')}
              className={`px-4 py-2 rounded transition-all ${activeTab === 'table' ? 'bg-primary text-white shadow-md' : 'bg-white border-2 border-primary text-primary'}`}
            >
              عرض الجدول
            </motion.button>
          </div>
        </motion.div>

        {activeTab === 'calendar' ? (
          <motion.div variants={fadeIn('up', 'spring', 0.4, 0.7)}>
            {/* رأس التقويم */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4 gap-3 items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevMonth}
                  className="px-4 py-2 mx-2 bg-primary/20 text-primary-700 rounded hover:bg-primary/40 transition-all"
                >
                  السابق
                </motion.button>
                <h2 className="text-xl font-semibold">
                  {format(currentMonth, 'MMMM yyyy', { locale: ar })}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextMonth}
                  className="px-4 py-2 bg-primary/20 text-primary-700 rounded hover:bg-primary/40 transition-all"
                >
                  التالي
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingEvent(null);
                  setShowForm(true);
                }}
                className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-all shadow-md"
              >
                <Plus className="mr-2" /> إضافة حدث
              </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* عرض التقويم */}
              <motion.div
                variants={slideIn('left', 'spring', 0.5, 0.8)}
                className="lg:col-span-2 bg-white rounded-lg shadow p-4"
              >
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map((day, index) => (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="text-center font-medium text-primary-700 p-2"
                    >
                      {day}
                    </motion.div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((day, index) => {
                    const dayEvents = events.filter(event =>
                      isSameDay(new Date(event.startDate), day)
                    );
                    return (
                      <motion.div
                        key={day.toString()}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.01 }}
                        onClick={() => setSelectedDate(day)}
                        className={`min-h-24 p-2 border rounded cursor-pointer hover:bg-primary/10 transition-all
                        ${isSameMonth(day, currentMonth) ? 'bg-white' : 'bg-gray-100 text-gray-400'}
                        ${selectedDate && isSameDay(day, selectedDate) ? 'border-primary-500 border-2' : ''}
                      `}
                      >
                        <div className="text-center">{format(day, 'd')}</div>
                        {dayEvents.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {dayEvents.slice(0, 2).map((event, i) => (
                              <motion.div
                                key={event._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-xs p-1 bg-primary/20 text-primary-800 rounded truncate"
                              >
                                {event.description}
                              </motion.div>
                            ))}
                            {dayEvents.length > 2 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-primary-600"
                              >
                                +{dayEvents.length - 2} المزيد
                              </motion.div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* قائمة الأحداث للتاريخ المحدد */}
              <motion.div
                variants={slideIn('right', 'spring', 0.5, 0.8)}
                className="bg-white rounded-lg shadow p-4"
              >
                <h3 className="text-lg font-semibold text-primary-700 mb-4">
                  {selectedDate ? format(selectedDate, 'd MMMM yyyy', { locale: ar }) : 'اختر تاريخًا'}
                </h3>
                {selectedDate ? (
                  <motion.div
                    variants={staggerContainer(0.1, 0.2)}
                    className="space-y-3"
                  >
                    {selectedEvents.length === 0 ? (
                      <motion.p
                        variants={fadeIn('up', 'spring')}
                        className="text-gray-500"
                      >
                        لا توجد أحداث في هذا اليوم
                      </motion.p>
                    ) : (
                      <AnimatePresence>
                        {selectedEvents.map((event, index) => (
                          <motion.div
                            key={event._id}
                            variants={fadeIn('up', 'spring', index * 0.1, 0.5)}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            className="border rounded p-3 hover:bg-primary/10 transition-all"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-primary-800">{event.description}</h4>
                                <p className=" text-md text-gray-600">{event.address}</p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    setEditingEvent(event);
                                    setShowForm(true);
                                  }}
                                  className="text-primary-600 hover:text-primary-800"
                                >
                                  <Edit />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDelete(event._id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </motion.div>
                ) : (
                  <motion.p
                    variants={fadeIn('up', 'spring')}
                    className="text-gray-500"
                  >
                    الرجاء اختيار تاريخ لعرض الأحداث
                  </motion.p>
                )}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* عرض جدول جميع الأحداث */
          <motion.div
            variants={fadeIn('up', 'spring', 0.4, 0.7)}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-primary-700">جميع الأحداث</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingEvent(null);
                  setShowForm(true);
                }}
                className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-all shadow-md"
              >
                <Plus className="mr-2" /> إضافة حدث جديد
              </motion.button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-primary">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-center  text-md font-medium text-white font-cairo  tracking-wider">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => requestSort('description')}
                        className="flex items-center justify-center gap-2 w-full"
                      >
                        الوصف
                        {sortConfig.key === 'description' && (
                          sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </motion.button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-center  text-md font-medium text-white font-cairo   tracking-wider">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => requestSort('address')}
                        className="flex items-center justify-center gap-2 w-full"
                      >
                        الموقع
                        {sortConfig.key === 'address' && (
                          sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </motion.button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-center  text-md font-medium text-white font-cairo   tracking-wider">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => requestSort('startDate')}
                        className="flex items-center  justify-center gap-2 w-full"
                      >
                        تاريخ البدء
                        {sortConfig.key === 'startDate' && (
                          sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </motion.button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-center  text-md font-medium text-white font-cairo   tracking-wider">
                      تاريخ الانتهاء
                    </th>
                    <th scope="col" className="px-6 py-3 text-center  text-md font-medium text-white font-cairo   tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center">
                  <AnimatePresence>
                    {events.map((event, index) => (
                      <motion.tr
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap  text-md font-medium text-gray-900">
                          {event.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap  text-md text-gray-500">
                          {event.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap  text-md text-gray-500">
                          {format(new Date(event.startDate), 'yyyy/MM/dd - h:mm a')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap  text-md text-gray-500">
                          {event.endDate ? format(new Date(event.endDate), 'yyyy/MM/dd - h:mm a') : '--'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap  text-md font-medium">
                          <div className="flex space-x-2  justify-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setEditingEvent(event);
                                setShowForm(true);
                              }}
                              className="text-primary-600 hover:text-primary-800"
                            >
                              <Edit />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setdeletingEvent(event);
                                setIsDeleteEvent(true)
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* نموذج إضافة/تعديل حدث */}
        {isDeleteEvent &&
          (
            <Modal
              isOpen={isDeleteEvent}
              type='delete'
              onConfirm={() => deletingEvent && handleDelete(deletingEvent._id)}
              onClose={() => { setIsDeleteEvent(false) }}
              extraStyle='bg-primary'
              title={'حذف الحدث'}
            >
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mt-1">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">هل أنت متأكد من حذف الحدث؟</p>
                    <p className="text-sm text-gray-600 mt-1">
                      سيتم حذف الحدث بشكل دائم ولا يمكن استعادته.
                    </p>
                  </div>
                </div>
              </div>
            </Modal>
          )
        }
        <AnimatePresence>
          {showForm && (
            <Modal
              isOpen={showForm}
              onClose={() => { setShowForm(false) }}
              extraStyle='bg-primary'
              title={editingEvent ? 'تعديل الحدث' : 'إضافة حدث جديد'}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="rounded-lg w-full"
              >
                <EventForm
                  initialData={editingEvent || undefined}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                  }}
                />
              </motion.div>

            </Modal>
          )}
        </AnimatePresence>
      </motion.div>

    </section>
  );
};

export default EventCalendar;