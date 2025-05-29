import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteTransactionMutation, useGetTransactionsQuery } from '../../../../store/api/financialApi';
import Modal from '../../../ui/Modal';
import { toast } from 'react-toastify';
import { Edit2, PlusCircle, Trash2, Search, Eye } from 'lucide-react';
import AddTransactionForm from './TransactionForm';

interface Transaction {
    _id: string;
    name: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    category: string;
}

const TransactionsList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' } | null>(null);
    let limit = 10;

    const { data, isLoading, isError } = useGetTransactionsQuery({
        page,
        limit,
        type: typeFilter || undefined,
        search: searchQuery || undefined,
    });

    const [deleteTransaction] = useDeleteTransactionMutation();

    const handleSort = (key: keyof Transaction) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof Transaction) => {
        if (!sortConfig || sortConfig.key !== key) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                    stroke="currentColor" aria-hidden="true" className="w-4 h-4 opacity-50">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                </svg>
            );
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                stroke="currentColor" aria-hidden="true" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d={sortConfig.direction === 'asc' ?
                        "M19.5 8.25l-7.5 7.5-7.5-7.5" :
                        "M4.5 15.75l7.5-7.5 7.5 7.5"}></path>
            </svg>
        );
    };

    const handleDeleteClick = (transaction: Transaction) => {
        setTransactionToDelete(transaction);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!transactionToDelete) return;

        try {
            await deleteTransaction(transactionToDelete._id).unwrap();
            toast.success("تم حذف المعاملة بنجاح");
            setIsDeleteModalOpen(false);
            setTransactionToDelete(null);
        } catch (error) {
            toast.error("فشل في حذف المعاملة");
            console.error("Delete error:", error);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (isError) return (
        <div className="p-6 bg-red-50 text-red-600 rounded-lg text-center">
            حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.
        </div>
    );

    return (
        <div className="relative flex flex-col w-full h-full text-primary bg-white rounded-xl shadow-sm">
            <div className="p-6">
                <div>
                    <h3 className="text-2xl font-bold text-primary">المعاملات المالية</h3>
                    <p className="text-slate-500 mt-1">قائمة بجميع المعاملات المالية</p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-6">
                    <div className="mt-4">
                        <div className="relative w-[35vw]">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <Search className="text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="w-full pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="ابحث عن معاملة..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <option value="">جميع الأنواع</option>
                            <option value="income">إيراد</option>
                            <option value="expense">مصروف</option>
                        </select>

                        <button
                            onClick={()=>setIsAddModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            <PlusCircle className="h-5 w-5" />
                            معاملة جديدة
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        الاسم
                                        {getSortIcon('name')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('amount')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        المبلغ
                                        {getSortIcon('amount')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('type')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        النوع
                                        {getSortIcon('type')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('date')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        التاريخ
                                        {getSortIcon('date')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('category')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        الفئة
                                        {getSortIcon('category')}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {data && data?.transactions.length > 0 ? (
                                [...data.transactions].sort((a, b) => {
                                    if (!sortConfig) return 0;

                                    const aValue = a[sortConfig.key];
                                    const bValue = b[sortConfig.key];

                                    if (aValue < bValue) {
                                        return sortConfig.direction === 'asc' ? -1 : 1;
                                    }
                                    if (aValue > bValue) {
                                        return sortConfig.direction === 'asc' ? 1 : -1;
                                    }
                                    return 0;
                                }).map((transaction) => (
                                    <tr key={transaction._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-center font-medium text-slate-900">
                                                {transaction.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-center font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {transaction.amount} ر.س
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-md ${transaction.type === 'income'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {transaction.type === 'income' ? 'إيراد' : 'مصروف'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">
                                            {new Date(transaction.date).toLocaleDateString('ar-SA')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                                                    {transaction.category}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <div className="flex justify-center space-x-2 gap-2">
                                                <button
                                                    onClick={() => navigate(`/transactions/${transaction._id}`)}
                                                    className="text-slate-600 hover:text-primary transition-colors"
                                                    title="عرض"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/transactions/${transaction._id}/edit`)}
                                                    className="text-slate-600 hover:text-yellow-600 transition-colors"
                                                    title="تعديل"
                                                >
                                                    <Edit2 className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(transaction)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                    title="حذف"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-slate-500">
                                        لا توجد معاملات متاحة
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {data?.pagination && data.pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 px-2">
                        <div className="text-sm text-slate-500">
                            عرض <span className="font-medium">{(page - 1) * limit + 1}</span> إلى{' '}
                            <span className="font-medium">
                                {Math.min(page * limit, data.pagination.totalItems)}
                            </span>{' '}
                            من <span className="font-medium">{data.pagination.totalItems}</span> نتائج
                        </div>
                        <div className="flex space-x-2 gap-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className={`px-3 py-1 rounded-md border ${page === 1 ?
                                    'bg-slate-100 text-slate-400 cursor-not-allowed' :
                                    'bg-white text-primary hover:bg-slate-50'
                                    }`}
                            >
                                السابق
                            </button>
                            {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-1 rounded-md ${page === pageNum ?
                                        'bg-primary text-white' :
                                        'bg-white text-primary hover:bg-slate-100 border'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === data.pagination.totalPages}
                                className={`px-3 py-1 rounded-md border ${page === data.pagination.totalPages ?
                                    'bg-slate-100 text-slate-400 cursor-not-allowed' :
                                    'bg-white text-primary hover:bg-slate-50'
                                    }`}
                            >
                                التالي
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="حذف معاملة"
            >
                <div className="space-y-4">
                    <p className="text-lg">هل أنت متأكد من حذف المعاملة {transactionToDelete?.name}؟</p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            تأكيد الحذف
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="أضافة معاملة جديدة"
            >
                <AddTransactionForm />
            </Modal>
        </div>
    );
};

export default TransactionsList;