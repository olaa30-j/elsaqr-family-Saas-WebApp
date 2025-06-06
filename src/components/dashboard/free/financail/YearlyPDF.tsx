import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format, subYears } from 'date-fns';
import { arSA } from 'date-fns/locale';

// تسجيل خط عربي
Font.register({
  family: 'Tajawal',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/tajawal/v3/Iurf6YBj_oCad4k1l_6gLrZjiLlJ-G0.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/tajawal/v3/Iurf6YBj_oCad4k1l5qjLrZjiLlJ-G0.ttf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Tajawal',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: 2,
    borderColor: '#E5E7EB',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 15,
  },
  period: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'left',
  },
  cardsContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  card: {
    width: '30%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalValue: {
    color: '#1E40AF',
  },
  incomeValue: {
    color: '#10B981',
  },
  expenseValue: {
    color: '#EF4444',
  },
  currency: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 10,
    color: '#6B7280',
  },
});

interface AnnualReportPDFProps {
  transactions: {
    amount: number;
    type: 'income' | 'expense';
    date: string;
  }[];
}

const AnnualReportPDF = ({ transactions }: AnnualReportPDFProps) => {
  // تحديد تاريخ بداية ونهاية السنة الماضية
  const currentDate = new Date();
  const startOfLastYear = subYears(currentDate, 1);
  startOfLastYear.setMonth(0, 1);
  startOfLastYear.setHours(0, 0, 0, 0);
  
  const endOfLastYear = subYears(currentDate, 1);
  endOfLastYear.setMonth(11, 31);
  endOfLastYear.setHours(23, 59, 59, 999);

  // فلترة معاملات السنة الماضية
  const lastYearTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= startOfLastYear && transactionDate <= endOfLastYear;
  });

  // حساب الإحصائيات
  const totalDonations = lastYearTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = lastYearTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const currentBalance = totalDonations - totalExpenses;

  // تنسيق التواريخ للعرض
  const formattedStartDate = format(startOfLastYear, 'yyyy/MM/dd', { locale: arSA });
  const formattedEndDate = format(endOfLastYear, 'yyyy/MM/dd', { locale: arSA });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>التقرير المالي السنوي</Text>
          <Text style={styles.period}>
            {format(currentDate, 'yyyy/MM/dd', { locale: arSA })}
          </Text>
        </View>

        <Text style={styles.reportTitle}>
          تقرير السنة الماضية ({formattedStartDate} - {formattedEndDate})
        </Text>

        <View style={styles.cardsContainer}>
          {/* بطاقة إجمالي مبلغ الصندوق */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>إجمالي مبلغ الصندوق</Text>
            <View style={styles.currency}>
              <Text style={[styles.cardValue, styles.totalValue]}>
                {currentBalance.toLocaleString('ar-SA')}
              </Text>
              <Text> ر.س</Text>
            </View>
          </View>

          {/* بطاقة إجمالي التبرعات */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>إجمالي التبرعات</Text>
            <View style={styles.currency}>
              <Text style={[styles.cardValue, styles.incomeValue]}>
                {totalDonations.toLocaleString('ar-SA')}
              </Text>
              <Text> ر.س</Text>
            </View>
          </View>

          {/* بطاقة إجمالي المصروفات */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>إجمالي المصروفات</Text>
            <View style={styles.currency}>
              <Text style={[styles.cardValue, styles.expenseValue]}>
                {totalExpenses.toLocaleString('ar-SA')}
              </Text>
              <Text> ر.س</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            تاريخ الطباعة: {format(currentDate, 'yyyy/MM/dd HH:mm', { locale: arSA })}
          </Text>
          <Text style={styles.footerText}>
            نظام إدارة التبرعات - الإصدار 1.0
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default AnnualReportPDF;