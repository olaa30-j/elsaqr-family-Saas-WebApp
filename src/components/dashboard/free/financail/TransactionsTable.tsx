import { Trash2, Printer, Edit } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TransactionPDF from './TransactionPDF';
import { DEFAULT_IMAGE } from '../../../auth/RegisterationForm';
import type { Transaction } from '../../../../types/financial';

/**
 * Props interface for the TransactionsTable component
 */
interface TransactionsTableProps {
    transactions: Transaction[]; // Array of transaction objects
    canEditFinancial: boolean; // Whether edit functionality is enabled
    canDeleteFinancial: boolean; // Whether delete functionality is enabled
    onDelete: (transaction: Transaction) => void; // Delete handler
    onView: (transaction: Transaction) => void; // View handler (unused in current implementation)
    onEdit: (transaction: Transaction) => void; // Edit handler
    sortConfig?: { // Current sort configuration
        key: keyof Transaction; // Field to sort by
        direction: 'asc' | 'desc'; // Sort direction
    } | null;
    onSort: (key: keyof Transaction) => void; // Sort handler
}

/**
 * Helper function to translate transaction type/category labels to Arabic
 * @param type - The transaction type/category
 * @returns Translated label in Arabic
 */
const getTypeLabel = (type: string) => {
    switch(type) {
        case 'donations': return 'تبرعات';
        case 'other': return 'أخرى';
        default: return type; // Fallback to original value if no translation
    }
};

/**
 * TransactionsTable Component - Displays a table of financial transactions
 * with sorting, editing, deleting, and PDF export capabilities.
 */
const TransactionsTable = ({
    canEditFinancial,
    canDeleteFinancial,
    transactions,
    sortConfig,
    onSort,
    onDelete,
    onEdit
}: TransactionsTableProps) => {
    
    /**
     * Generates sort icon based on current sort configuration
     * @param key - The column key being sorted
     * @returns SVG sort icon with appropriate direction indicator
     */
    const getSortIcon = (key: string) => {
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

    return (
        <section className="overflow-x-auto -mt-10">
            {/* Main transactions table */}
            <table className="min-w-full divide-y divide-slate-200 rounded-lg border border-primary/20">
                {/* Table header */}
                <thead className="bg-primary">
                    <tr className="rounded-2xl">
                        {/* Empty column for image */}
                        <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider"></th>
                        
                        {/* Name column with sort capability */}
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => onSort && onSort('name')}
                        >
                            <div className="flex items-center justify-center gap-1">
                                الاسم
                                {getSortIcon('name')}
                            </div>
                        </th>

                        {/* Client column */}
                        <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">
                            العميل
                        </th>
                        
                        {/* Amount column with sort capability */}
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => onSort && onSort('amount')}
                        >
                            <div className="flex items-center justify-center gap-1">
                                المبلغ
                                {getSortIcon('amount')}
                            </div>
                        </th>
                        
                        {/* Type column with sort capability */}
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => onSort && onSort('type')}
                        >
                            <div className="flex items-center justify-center gap-1">
                                النوع
                                {getSortIcon('type')}
                            </div>
                        </th>
                        
                        {/* Date column with sort capability */}
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => onSort && onSort('date')}
                        >
                            <div className="flex items-center justify-center gap-1">
                                التاريخ
                                {getSortIcon('date')}
                            </div>
                        </th>
                        
                        {/* Category column with sort capability */}
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => onSort && onSort('category')}
                        >
                            <div className="flex items-center justify-center gap-1">
                                الفئة
                                {getSortIcon('category')}
                            </div>
                        </th>
                        
                        {/* Actions column */}
                        <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">
                            الإجراءات
                        </th>
                    </tr>
                </thead>

                {/* Table body */}
                <tbody className="bg-white divide-y divide-slate-200">
                    {transactions.length > 0 ? (
                        // Sort transactions if sortConfig exists
                        [...transactions].sort((a, b) => {
                            if (!sortConfig) return 0;

                            const aValue: any = a[sortConfig.key];
                            const bValue: any = b[sortConfig.key];

                            if (aValue < bValue) {
                                return sortConfig.direction === 'asc' ? -1 : 1;
                            }
                            if (aValue > bValue) {
                                return sortConfig.direction === 'asc' ? 1 : -1;
                            }
                            return 0;
                        }).map((transaction) => (
                            // Transaction row
                            <tr key={transaction._id} className="hover:bg-slate-50 transition-colors">
                                {/* Transaction image */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex justify-center w-15">
                                        {transaction.image ? (
                                            <img
                                                className="w-15 h-10 rounded-md cursor-pointer hover:opacity-80"
                                                src={transaction.image}
                                                alt="Transaction"
                                                onClick={() => window.open(transaction.image, '_blank')}
                                            />
                                        ) : (
                                            <span className="text-slate-400">لا يوجد</span>
                                        )}
                                    </div>
                                </td>
                                
                                {/* Transaction name */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-center font-medium text-slate-900">
                                        {transaction.name}
                                    </div>
                                </td>

                                {/* Client information */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-1">
                                        {transaction.createdBy ? (
                                            <>
                                                <img
                                                    className="w-8 h-8 rounded-full mx-2"
                                                    src={transaction?.createdBy?.memberId?.image || DEFAULT_IMAGE}
                                                    alt={transaction?.createdBy?.email}
                                                />
                                                <span>{transaction.createdBy.email}</span>
                                            </>
                                        ) : (
                                            <span className="text-slate-400">غير محدد</span>
                                        )}
                                    </div>
                                </td>

                                {/* Transaction amount */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-center font-medium flex gap-1 items-center text-color-2`}>
                                        {transaction.amount.toLocaleString('ar-SA')} 
                                        <img src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg" 
                                             alt="Saudi Riyal" 
                                             className='w-4 h-4' />
                                    </div>
                                </td>
                                
                                {/* Transaction type (income/expense) */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex justify-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                                            transaction.type === 'income'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {transaction.type === 'income' ? 'إيراد' : 'مصروف'}
                                        </span>
                                    </div>
                                </td>
                                
                                {/* Transaction date */}
                                <td className="px-6 py-4 whitespace-nowrap text-md text-slate-500 text-center">
                                    {new Date(transaction.date).toLocaleDateString('ar-SA', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                                
                                {/* Transaction category */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex justify-center">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                                            {getTypeLabel(transaction.category)} 
                                        </span>
                                    </div>
                                </td>
                                
                                {/* Action buttons */}
                                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-center">
                                    <div className="flex justify-center items-center space-x-2 gap-2">
                                        {/* Edit button (conditionally rendered) */}
                                        {canEditFinancial && (
                                            <button
                                                onClick={() => onEdit(transaction)}
                                                className="text-slate-600 hover:text-yellow-600 transition-colors"
                                                title="تعديل"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                        )}
                                        
                                        {/* Delete button (conditionally rendered) */}
                                        {canDeleteFinancial && (
                                            <button
                                                onClick={() => onDelete(transaction)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                title="حذف"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        )}

                                        {/* PDF export button */}
                                        <PDFDownloadLink
                                            document={<TransactionPDF transaction={transaction} />}
                                            fileName={`transaction_${transaction._id}.pdf`}
                                        >
                                            {({ loading }) => (
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    title="طباعة"
                                                    disabled={loading}
                                                >
                                                    <Printer className="h-5 w-5" />
                                                </button>
                                            )}
                                        </PDFDownloadLink>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        // Empty state
                        <tr>
                            <td colSpan={9} className="px-6 py-4 text-center text-slate-500">
                                لا توجد معاملات متاحة
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
};

export default TransactionsTable;