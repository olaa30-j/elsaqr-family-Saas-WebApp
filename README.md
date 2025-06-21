# نظام إدارة عائلة الدهماش
## جدول المحتويات
- [نظرة عامة](#نظرة-عامة)
- [المميزات](#المميزات)
- [هيكل المشروع](#هيكل-المشروع)
- [التقنيات المستخدمة](#التقنيات-المستخدمة)
- [التثبيت](#التثبيت)
- [أوامر التطوير](#أوامر-التطوير)
- [المساهمة](#المساهمة)
- [الترخيص](#الترخيص)

## نظرة عامة

نظام إدارة عائلة الدهماش هو منصة متكاملة لإدارة شؤون العائلة تشمل:

- إدارة شجرة العائلة
- تنظيم الأحداث والمناسبات
- متابعة الأمور المالية
- أرشيف الصور والذكريات
- نظام صلاحيات متقدم

## المميزات

### المميزات الأساسية
- 🌳 **شجرة العائلة** - تصور العلاقات العائلية
- 🔐 **نظام صلاحيات** - تحكم دقيق في الصلاحيات
- 📅 **الأحداث** - تقويم لإدارة المناسبات
- 💰 **المالية** - متابعة الدخل والمصروفات
- 🖼️ **الألبومات** - تنظيم الصور والذكريات

### مميزات إضافية
- لوحة تحكم مع إحصائيات
- نظام إشعارات
- إنشاء تقارير PDF
- بحث متقدم
- تصميم متجاوب لجميع الأجهزة

## هيكل المشروع
dahmash-family/
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── free/
│   ├── admin/
│   ├── advertisement/
│   ├── album/
│   ├── events/
│   ├── financial/
│   ├── main/
│   ├── members/
│   ├── profile/
│   ├── roles/
│   ├── users/
│   ├── EditImage.tsx
│   ├── premium/
│   ├── home/
│   ├── layouts/
│   ├── shared/
│   └── ui/
├── features/
│   ├── auth/
│   ├── notifications/
│   ├── permissions/
│   ├── subscription/
│   ├── hooks/
│   │   ├── useAlbumImages.ts
│   │   ├── useAlbums.ts
│   │   ├── useFamilyBranches.ts
│   │   └── usePermission.ts
│   ├── middleware/
│   │   └── permissionMiddleware.ts
│   └── routes/
│       ├── index.tsx
│       ├── premiumRoutes.tsx
│       └── ProtectedRoute.tsx
├── services/
│   ├── advertisementApi.ts
│   ├── albumApi.ts
│   ├── authApi.ts
│   ├── baseApi.ts
│   ├── branchApi.ts
│   ├── chartsApi.ts
│   ├── eventApi.ts
│   ├── financialApi.ts
│   ├── memberApi.ts
│   ├── notificationApi.ts
│   ├── permissionApi.ts
│   ├── roleApi.ts
│   ├── usersApi.ts
│   └── store.ts
├── utils/
│   ├── motion.ts
│   ├── permissions.ts
│   ├── swiper-setup.ts
│   └── utils.ts
├── views/
│   ├── album/
│   ├── auth/
│   ├── contactus/
│   ├── dashboard/
│   ├── admin/
│   ├── familyTree/
│   ├── financial/
│   └── profile/
├── dashboard.module.tsx
├── Dashboard.tsx
├── errors/
├── home/
└── App.tsx


## التقنيات المستخدمة

### الواجهة الأمامية
- React 19
- TypeScript
- Redux Toolkit
- React Router
- TailwindCSS

### التصور البياني
- Chart.js
- D3.js
- OrgChart.js

### الأدوات المساعدة
- date-fns
- Yup
- React Hook Form

## التثبيت

1. تنزيل المشروع:
   ```bash
   git clone [https://github.com/olaa30-j/elsaqr-family-Saas-WebApp.git](https://github.com/olaa30-j/elsaqr-family-Saas-WebApp.git)
   cd dahmash-family
   npm install
   npm run dev
