import RegistrationForm from "../../components/auth/RegisterationForm"

const RegisterationPage = () => {
  return (
    <div className="app-container min-h-screen flex flex-col ">
      <div className="min-h-screen py-12 px-4 ">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            <div className="w-full lg:w-3/5 lg:pr-8">
              <div className="mb-8 text-center lg:text-right">
                <h1 className="text-3xl font-bold mb-2">
                  تسجيل عضوية جديدة
                </h1>
                <p className="text-muted-foreground">
                  يرجى تعبئة النموذج التالي للانضمام إلى عائلة الصقر الدهمش
                </p>
              </div>

              <RegistrationForm />
            </div>


            <div className="w-full lg:w-2/5" style={{ opacity: 1, transform: 'none' }}>
              <div className="bg-primary/5 rounded-xl p-8 h-full" style={{ opacity: 1, transform: 'none' }}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-primary mb-3">عائلة الصقر الدهمش</h2>
                  <p className="text-muted-foreground">انضم إلى مجتمعنا العائلي واستفد من الخدمات المميزة:</p>
                </div>

                <ul className="space-y-4">
                  <li className="flex gap-3" style={{ opacity: 1, transform: 'none' }}>
                    <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-circle-check h-5 w-5 text-primary"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">شجرة العائلة التفاعلية</h3>
                      <p className="text-sm text-muted-foreground">اكتشف تراث العائلة من خلال شجرة العائلة الرقمية</p>
                    </div>
                  </li>

                  <li className="flex gap-3" style={{ opacity: 1, transform: 'none' }}>
                    <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-circle-check h-5 w-5 text-primary"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">فعاليات واجتماعات</h3>
                      <p className="text-sm text-muted-foreground">تعرف على مواعيد اجتماعات العائلة والفعاليات القادمة</p>
                    </div>
                  </li>

                  <li className="flex gap-3" style={{ opacity: 1, transform: 'none' }}>
                    <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-circle-check h-5 w-5 text-primary"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">معرض الصور</h3>
                      <p className="text-sm text-muted-foreground">شارك واستعرض صور العائلة والذكريات المشتركة</p>
                    </div>
                  </li>

                  <li className="flex gap-3" style={{ opacity: 1, transform: 'none' }}>
                    <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-circle-check h-5 w-5 text-primary"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">التواصل الفعال</h3>
                      <p className="text-sm text-muted-foreground">ابق على اطلاع بجميع الأخبار والإعلانات المتعلقة بالعائلة</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8 p-4 bg-white/50 rounded-lg">
                  <blockquote className="italic text-muted-foreground text-sm">
                    "تطبيق عائلة الصقر الدهمش يعزز التواصل ويحافظ على قيم الترابط العائلي ويوثق تاريخنا المشترك للأجيال القادمة."
                  </blockquote>
                  <p className="mt-2 text-sm font-medium">- مجلس العائلة</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterationPage