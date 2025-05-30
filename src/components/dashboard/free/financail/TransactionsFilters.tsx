import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface TransactionsFiltersProps {
    typeFilter: string;
    setTypeFilter: (value: string) => void;
    timeFilter: string;
    setTimeFilter: (value: string) => void;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    setPage: (page: number) => void;
}

/**
 * Filter controls for transactions list including time period, type, and search.
 * 
 * @component
 * @param {TransactionsFiltersProps} props - Component props
 */
const TransactionsFilters = ({
    typeFilter,
    setTypeFilter,
    timeFilter,
    setTimeFilter,
    searchQuery,
    setSearchQuery,
    setPage
}: TransactionsFiltersProps) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col-reverse gap-4 mt-20 mb-15"
        >
            {/* Top row: Filters */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
                {/* Time filter */}
                <div className="relative flex-1 min-w-[180px]">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                        value={timeFilter}
                        onChange={(e) => {
                            setTimeFilter(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    >
                        <option value="">كل الفترات</option>
                        <option value="week">آخر أسبوع</option>
                        <option value="month">آخر شهر</option>
                        <option value="3months">آخر 3 أشهر</option>
                        <option value="6months">آخر 6 أشهر</option>
                        <option value="year">آخر سنة</option>
                    </select>
                </div>

                {/* Type filter */}
                <div className="relative flex-1 min-w-[180px]">
                    <select
                        value={typeFilter}
                        onChange={(e) => {
                            setTypeFilter(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    >
                        <option value="">جميع الأنواع</option>
                        <option value="income">إيراد</option>
                        <option value="expense">مصروف</option>
                    </select>
                </div>
            </div>

            {/* Bottom row: Search */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        placeholder="ابحث عن معاملة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default TransactionsFilters;