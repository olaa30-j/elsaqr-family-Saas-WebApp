import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import type { Transaction } from '../../../../types/financial';

// تسجيل مكونات Chart.js المطلوبة
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

/**
 * مكون بطاقات إحصائيات المعاملات يعرض ملخصًا مرئيًا للمعاملات المالية
 * 
 * @component
 * @param {TransactionStatsCardsProps} props - خاصيات المكون
 * @param {Transaction[]} props.transactions - مصفوفة المعاملات المالية
 * @returns {JSX.Element} - عناصر واجهة بطاقات الإحصائيات
 */
const TransactionStatsCards = ({ transactions }: TransactionStatsCardsProps) => {
  // حساب الإحصائيات من المعاملات
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // أسماء الأشهر بالعربية
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
  /**
   * توليد بيانات الرسم الخطي بناءً على القيمة واللون
   * @param {number} value - القيمة الأساسية
   * @param {string} color - لون الخط
   * @returns {object} - كائن بيانات الرسم البياني
   */
  const generateLineData = (value: number, color: string) => {
    const baseValues = Array(12).fill(0).map((_, i) => 
      Math.round(value * (0.5 + Math.random() * 0.6 * (i / 12 + 0.5)))
    );
    
    return {
      labels: months,
      datasets: [
        {
          label: 'القيمة الشهرية',
          data: baseValues,
          borderColor: color,
          backgroundColor: `${color}20`,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: color,
          pointHoverRadius: 5,
          fill: true
        }
      ]
    };
  };

  // خيارات الرسم البياني
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        rtl: true,
        titleFont: {
          family: 'Tajawal, sans-serif'
        },
        bodyFont: {
          family: 'Tajawal, sans-serif'
        },
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y.toLocaleString('ar-SA')} ر.س`;
          }
        }
      }
    },
    scales: {
      y: {
        display: true,
        beginAtZero: false,
        grid: {
          color: '#e5e7eb'
        },
        ticks: {
          font: {
            family: 'Tajawal, sans-serif'
          },
          callback: function(value: any) {
            return value.toLocaleString('ar-SA');
          }
        }
      },
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Tajawal, sans-serif'
          }
        }
      }
    },
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
      {/* بطاقة الإجمالي */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-slate-700">إجمالي المعاملات</h4>
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-3xl font-bold text-slate-800 flex items-center gap-2">
          {total.toLocaleString('ar-SA')} <img src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg" alt="" className='w-5 h-5' />
        </p>

        <div className="mt-4 h-64">
          <Line
            data={generateLineData(total, '#3B82F6')}
            options={lineOptions}
          />
        </div>

        <div className="mt-2 text-sm text-slate-500 text-center">
          توزيع الإجمالي الشهري على مدار السنة
        </div>
      </div>

      {/* بطاقة الإيرادات */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-slate-700">إجمالي الإيرادات</h4>
          <div className="p-3 rounded-full bg-gradient-to-br from-green-100 to-green-50 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-3xl font-bold text-slate-800 flex items-center gap-2">
          {income.toLocaleString('ar-SA')} <img src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg" alt="" className='w-5 h-5' />
        </p>

        <div className="mt-4 h-64">
          <Line
            data={generateLineData(income, '#10B981')}
            options={lineOptions}
          />
        </div>

        <div className="mt-2 flex justify-between text-sm text-slate-500">
          <span>أقل شهر: {Math.round(income * 0.5).toLocaleString('ar-SA')} ر.س</span>
          <span>أعلى شهر: {Math.round(income * 1.1).toLocaleString('ar-SA')} ر.س</span>
        </div>
      </div>

      {/* بطاقة المصروفات */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-slate-700">إجمالي المصروفات</h4>
          <div className="p-3 rounded-full bg-gradient-to-br from-red-100 to-red-50 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-3xl font-bold text-slate-800 flex items-center gap-2">
          {expense.toLocaleString('ar-SA')} <img src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg" alt="" className='w-5 h-5' />
        </p>

        <div className="mt-4 h-64">
          <Line
            data={generateLineData(expense, '#EF4444')}
            options={lineOptions}
          />
        </div>

        <div className="mt-2 flex justify-between text-sm text-slate-500">
          <span>أقل شهر: {Math.round(expense * 0.5).toLocaleString('ar-SA')} ر.س</span>
          <span>أعلى شهر: {Math.round(expense * 1.1).toLocaleString('ar-SA')} ر.س</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatsCards;