import { PDFDownloadLink } from '@react-pdf/renderer';
import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import AnnualReportPDF from './YearlyPDF';
import { Printer } from 'lucide-react';

ChartJS.register(
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler
);

interface TransactionStatsCardsProps {
    transactions: Transaction[];
}

interface Transaction {
    amount: number;
    type: 'income' | 'expense';
    date: string;
}

/**
 * مكون بطاقات إحصائيات المعاملات المبسطة
 */
const SimpleStatsCards = ({ transactions }: TransactionStatsCardsProps) => {
    // فلترة معاملات السنة الماضية
    const lastYearTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return transactionDate >= oneYearAgo;
    });

    // حساب الإحصائيات للسنة الماضية
    const totalDonations = lastYearTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = lastYearTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = totalDonations - totalExpenses;

    return (
        <div>
            <div className='w-full flex justify-end'>
                <PDFDownloadLink
                    document={<AnnualReportPDF transactions={transactions} />}
                    fileName="التقرير_المالي_السنوي.pdf"
                >
                    {({ loading }) => (
                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:text-white bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary transition-colors"
                            disabled={loading}
                        > {loading ? 'جاري التجهيز...' : (
                            <>
                                <Printer className="h-5 w-5" />
                                تحميل التقرير السنوي
                            </>
                        )}
                        </button>
                    )}
                </PDFDownloadLink>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                {/* بطاقة إجمالي مبلغ الصندوق */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-slate-700">إجمالي مبلغ الصندوق</h4>
                        <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-slate-800 flex items-center gap-2">
                        {currentBalance.toLocaleString('ar-SA')} <img src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg" alt="" className='w-5 h-5' />
                    </p>
                    <div className="mt-2 text-sm text-slate-500">
                        الرصيد الحالي بعد خصم المصروفات
                    </div>
                </div>

                {/* بطاقة إجمالي التبرعات */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-slate-700">إجمالي التبرعات</h4>
                        <div className="p-3 rounded-full bg-gradient-to-br from-green-100 to-green-50 text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-slate-800 flex items-center gap-2">
                        {totalDonations.toLocaleString('ar-SA')} <img src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg" alt="" className='w-5 h-5' />
                    </p>
                    <div className="mt-2 text-sm text-slate-500">
                        تبرعات السنة الماضية فقط
                    </div>
                </div>

                {/* بطاقة إجمالي المصروفات */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-slate-700">إجمالي المصروفات</h4>
                        <div className="p-3 rounded-full bg-gradient-to-br from-red-100 to-red-50 text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-slate-800 flex items-center gap-2">
                        {totalExpenses.toLocaleString('ar-SA')} <img src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg" alt="" className='w-5 h-5' />
                    </p>
                    <div className="mt-2 text-sm text-slate-500">
                        مصروفات السنة الماضية فقط
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SimpleStatsCards;