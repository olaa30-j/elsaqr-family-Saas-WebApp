import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

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
    padding: 20,
    fontFamily: 'Tajawal',
    textAlign: 'right',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: 1,
    borderColor: '#E5E7EB',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'left',
  },
  summary: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'right', // محاذاة النص لليمين
  },
  summaryTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
    textAlign:'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  incomeValue: {
    color: '#10B981',
  },
  expenseValue: {
    color: '#EF4444',
  },
  filters: {
    flexDirection: 'row-reverse', // عكس اتجاه الصف
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  filterItem: {
    fontSize: 12,
    color: '#4B5563',
  },
  tableHeader: {
    flexDirection: 'row-reverse', // عكس اتجاه الصف
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableRow: {
    flexDirection: 'row-reverse', // عكس اتجاه الصف
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  incomeBadge: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  expenseBadge: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row-reverse', // عكس اتجاه الصف
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 10,
    color: '#6B7280',
  },
  detailsRow: {
    flexDirection: 'row-reverse', 
    marginBottom: 10,
  },
  detailsHalf: {
    width: '50%',
    paddingRight: 10,
  },
  detailsLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  detailsValue: {
    fontSize: 16,
  },
  arabicCurrency: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
  },
});

const TransactionPDF = ({
  transactions = [],
  filters = {},
  summary = {},
  transaction
}: any) => {
  if (transaction) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>تفاصيل المعاملة المالية</Text>
            <Text style={styles.date}>
              {format(new Date(), 'yyyy/MM/dd HH:mm', { locale: arSA })}
            </Text>
          </View>

          <View style={{ marginBottom: 20 }}>
            <View style={styles.detailsRow}>
              <View style={styles.detailsHalf}>
                <Text style={styles.detailsLabel}>اسم المعاملة</Text>
                <Text style={styles.detailsValue}>{transaction.name}</Text>
              </View>
              <View style={styles.detailsHalf}>
                <Text style={styles.detailsLabel}>المبلغ</Text>
                <View style={styles.arabicCurrency}>
                  <Text style={[
                    { marginLeft: 5 },
                    transaction.type === 'income' ? styles.incomeValue : styles.expenseValue
                  ]}>
                    {transaction.amount}
                  </Text>
                  <Text>ر.س</Text>
                </View>
              </View>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailsHalf}>
                <Text style={styles.detailsLabel}>النوع</Text>
                <Text style={[
                  styles.typeBadge,
                  transaction.type === 'income' ? styles.incomeBadge : styles.expenseBadge,
                  { width: 60, textAlign: 'center', paddingVertical: 4 }
                ]}>
                  {transaction.type === 'income' ? 'إيراد' : 'مصروف'}
                </Text>
              </View>
              <View style={styles.detailsHalf}>
                <Text style={styles.detailsLabel}>التاريخ</Text>
                <Text style={styles.detailsValue}>
                  {format(new Date(transaction.date), 'yyyy/MM/dd HH:mm', { locale: arSA })}
                </Text>
              </View>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailsHalf}>
                <Text style={styles.detailsLabel}>الفئة</Text>
                <Text style={styles.detailsValue}>{transaction.category}</Text>
              </View>
              {transaction._id && (
                <View style={styles.detailsHalf}>
                  <Text style={styles.detailsLabel}>رقم المرجع</Text>
                  <Text style={styles.detailsValue}>{transaction._id}</Text>
                </View>
              )}
            </View>

            {transaction.createdBy && (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.detailsLabel}>العميل</Text>
                <Text style={styles.detailsValue}>{transaction.createdBy.fname} {transaction.createdBy.lname}</Text>
              </View>
            )}
          </View>

          {transaction.image && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.detailsLabel}>صورة المعاملة</Text>
              <Image
                src={transaction.image}
                style={{
                  width: 200,
                  height: 150,
                  alignSelf: 'flex-end',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 4,
                }}
              />
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>معرف المعاملة: {transaction._id}</Text>
            <Text style={styles.footerText}>تاريخ الطباعة: {format(new Date(), 'yyyy/MM/dd HH:mm', { locale: arSA })}</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>التقرير المالي</Text>
          <Text style={styles.date}>
            {format(new Date(), 'yyyy/MM/dd HH:mm', { locale: arSA })}
          </Text>
        </View>

        {summary && (
          <View style={styles.summary}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>إجمالي المعاملات</Text>
              <View style={styles.arabicCurrency}>
                <Text style={{ marginLeft: 5, ...styles.summaryValue }}>
                  {summary.total.toString().slice(0, 4)  || 0}
                </Text>
                <Text>ر.س</Text>
              </View>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>إجمالي الإيرادات</Text>
              <View style={styles.arabicCurrency}>
                <Text style={{ marginLeft: 5, ...styles.summaryValue, ...styles.incomeValue }}>
                  {summary.income.toString().slice(0, 4) || 0}
                </Text>
                <Text>ر.س</Text>
              </View>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>إجمالي المصروفات</Text>
              <View style={styles.arabicCurrency}>
                <Text style={{ marginLeft: 5, ...styles.summaryValue, ...styles.expenseValue }}>
                  {summary.expense.toString().slice(0, 4)  || 0}
                </Text>
                <Text>ر.س</Text>
              </View>
            </View>
          </View>
        )}

        {filters && (
          <View style={styles.filters}>
            <Text style={styles.filterItem}>
              نوع المعاملة: {filters.type ? (filters.type === 'income' ? 'إيرادات' : 'مصروفات') : 'الكل'}
            </Text>
            <Text style={styles.filterItem}>
              الفترة: {getTimeFilterLabel(filters.time)}
            </Text>
            <Text style={styles.filterItem}>
              البحث: {filters.search || 'لا يوجد'}
            </Text>
          </View>
        )}

        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell]}>الاسم</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>المبلغ</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>النوع</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>التاريخ</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>الفئة</Text>
          </View>

          {transactions.map((transaction: any) => (
            <View key={transaction._id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{transaction.name}</Text>
              <View style={[styles.tableCell, styles.arabicCurrency, { justifyContent: 'center' }]}>
                <Text style={{
                  marginLeft: 5,
                  ...(transaction.type === 'income' ? styles.incomeValue : styles.expenseValue)
                }}>
                  {transaction.amount.toString().substring(0, 4)}
                </Text>
                <Text>ر.س</Text>
              </View>
              <Text style={[
                styles.tableCell,
                transaction.type === 'income' ? styles.incomeBadge : styles.expenseBadge,
                styles.typeBadge
              ]}>
                {transaction.type === 'income' ? 'إيراد' : 'مصروف'}
              </Text>
              <Text style={styles.tableCell}>
                {format(new Date(transaction.date), 'yyyy/MM/dd', { locale: arSA })}
              </Text>
              <Text style={styles.tableCell}>{transaction.category}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            عدد المعاملات: {transactions.length}
          </Text>
          <Text style={styles.footerText}>
            تاريخ الطباعة: {format(new Date(), 'yyyy/MM/dd HH:mm', { locale: arSA })}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

function getTimeFilterLabel(timeFilter: string) {
  switch (timeFilter) {
    case 'week': return 'آخر أسبوع';
    case 'month': return 'آخر شهر';
    case '3months': return 'آخر 3 أشهر';
    case '6months': return 'آخر 6 أشهر';
    case 'year': return 'آخر سنة';
    default: return 'كل الفترات';
  }
}

export default TransactionPDF;