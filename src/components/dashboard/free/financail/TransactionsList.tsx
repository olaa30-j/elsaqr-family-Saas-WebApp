import { useState, useEffect, useMemo } from 'react';
import { useGetTransactionsQuery, useDeleteTransactionMutation } from '../../../../store/api/financialApi';
import TransactionsFilters from './TransactionsFilters';
import TransactionsActions from './TransactionsActions';
import TransactionsTable from './TransactionsTable';
import TransactionStatsCards from './TransactionStatsCards';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { AnimatePresence, motion } from 'framer-motion';
import type { Transaction } from '../../../../types/financial';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '../../../../hooks/usePermission';

const TransactionsList = () => {
    const [page, setPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState('');
    const [timeFilter, setTimeFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' } | null>(null);
    const { hasPermission: canCreateFinancial } = usePermission('FINANCIAL_CREATE');
    const { hasPermission: canDeleteFinancial } = usePermission('FINANCIAL_DELETE');
    const { hasPermission: canEditFinancial } = usePermission('FINANCIAL_EDIT');

    const limit = 10;
    const navigate = useNavigate();

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setPage(1);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    const { data: allTransactionsData, isLoading, isError } = useGetTransactionsQuery({
        page: 1,
        limit: 1000,
        type: typeFilter || undefined,
        search: debouncedSearchQuery || undefined,
        time: timeFilter || undefined,
    }, {
        refetchOnMountOrArgChange: true,
    });

    // First filter the transactions
    const filteredTransactions = useMemo(() => {
        if (!allTransactionsData?.transactions) return [];

        let filtered = [...allTransactionsData.transactions];

        // Type filter
        if (typeFilter) {
            filtered = filtered.filter(t => t.type === typeFilter);
        }

        // Search filter
        if (debouncedSearchQuery) {
            const query = debouncedSearchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(query) ||
                (t.description && t.description.toLowerCase().includes(query))
            );
        }

        // Time filter
        if (timeFilter) {
            const now = new Date();
            let cutoffDate = new Date();

            switch (timeFilter) {
                case 'week': cutoffDate.setDate(now.getDate() - 7); break;
                case 'month': cutoffDate.setMonth(now.getMonth() - 1); break;
                case '3months': cutoffDate.setMonth(now.getMonth() - 3); break;
                case '6months': cutoffDate.setMonth(now.getMonth() - 6); break;
                case 'year': cutoffDate.setFullYear(now.getFullYear() - 1); break;
                default: break;
            }

            filtered = filtered.filter(t => new Date(t.date) >= cutoffDate);
        }

        return filtered;
    }, [allTransactionsData, typeFilter, debouncedSearchQuery, timeFilter]);

    // Then apply sorting
    const sortedTransactions = useMemo(() => {
        if (!filteredTransactions) return [];

        const sortableItems = [...filteredTransactions];
        if (sortConfig) {
            sortableItems.sort((a, b) => {
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
    }, [filteredTransactions, sortConfig]);

    // Finally apply pagination
    const paginatedTransactions = useMemo(() => {
        const startIndex = (page - 1) * limit;
        return sortedTransactions.slice(startIndex, startIndex + limit);
    }, [sortedTransactions, page, limit]);

    // Calculate total pages based on FILTERED transactions
    const totalPages = useMemo(() => {
        return Math.ceil(filteredTransactions.length / limit);
    }, [filteredTransactions, limit]);

    const [deleteTransaction] = useDeleteTransactionMutation();

    const handleDeleteClick = (transaction: Transaction) => {
        setTransactionToDelete(transaction);
        setIsDeleteModalOpen(true);
    };

    const handleSort = (key: keyof Transaction) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
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

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
            />
        </div>
    );

    if (isError) return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-red-50 text-red-600 rounded-lg text-center"
        >
            حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col w-full h-full text-primary bg-white rounded-xl shadow-sm"
        >
            <div className="p-6">
                <TransactionsActions
                    transactions={allTransactionsData?.transactions || []}
                    filters={{ typeFilter, timeFilter, debouncedSearchQuery }}
                    canCreateFinancial={canCreateFinancial}
                />

                <TransactionStatsCards transactions={allTransactionsData?.transactions || []} />

                <TransactionsFilters
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    timeFilter={timeFilter}
                    setTimeFilter={setTimeFilter}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setPage={setPage}
                />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <TransactionsTable
                        canDeleteFinancial={canDeleteFinancial}
                        canEditFinancial={canEditFinancial}
                        transactions={paginatedTransactions}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        onEdit={(transaction) => navigate(`/financial/${transaction._id}`)}
                        onDelete={handleDeleteClick}
                        onView={(transaction) => navigate(`/financial/${transaction._id}`)}
                    />
                </motion.div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 mb-16 px-2">
                    <div className="text-sm text-slate-500">
                        عرض <span className="font-medium">{(page - 1) * limit + 1}</span> إلى{' '}
                        <span className="font-medium">
                            {Math.min(page * limit, filteredTransactions.length)}
                        </span>{' '}
                        من <span className="font-medium">{filteredTransactions.length}</span> نتائج
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className={`px-3 py-1 rounded-md mx-2 ${page === 1
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary/90'
                                }`}
                        >
                            السابق
                        </button>

                        {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                                let pageNum;

                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (page <= 3) {
                                    pageNum = i + 1;
                                } else if (page >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = page - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`px-3 py-1 rounded-md ${page === pageNum
                                            ? 'bg-primary text-white'
                                            : 'bg-white text-primary hover:bg-primary/10 border border-primary'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            }
                        )}

                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page >= totalPages}
                            className={`px-3 py-1 rounded-md ${page >= totalPages
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-primary/90"
                                }`}
                        >
                            التالي
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isDeleteModalOpen && (
                    <DeleteConfirmationModal
                        transaction={transactionToDelete}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={confirmDelete}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TransactionsList;