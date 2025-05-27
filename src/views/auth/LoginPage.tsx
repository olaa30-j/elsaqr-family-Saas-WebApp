import { Link } from "react-router-dom"
import LoginForm from "../../components/auth/LoginForm"

const LoginPage = () => {
  return (
    <div className="app-container min-h-screen flex flex-col ">
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <img
              src="https://res.cloudinary.com/dmhvfuuke/image/upload/v1748029147/family-logo_z54fug.png"
              alt="شعار عائلة الصقر الدهمش"
              className="mx-auto h-28 w-28 object-contain"
            />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground font-heading">
              تسجيل الدخول
            </h2>
            <p className="mt-2 text-sm text-color-2">
              مرحبًا بك في تطبيق صندوق العائلة
            </p>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 pt-6">

              <LoginForm />
              <div className="mt-5 flex flex-col space-y-3">
                <a href="/forgot-password">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary underline-offset-4 hover:underline h-10 px-4 py-2 text-sm">
                    نسيت كلمة المرور؟
                  </button>
                </a>

                <div className="flex items-center gap-2">
                  <div className="bg-gray-200 h-[1px] w-full flex-1"></div>
                  <span className="text-xs text-gray-400 px-2">أو</span>
                  <div className="bg-gray-200 h-[1px] w-full flex-1"></div>
                </div>

                <Link to="/register">
                  <button className="gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-amber-600/80 hover:text-white h-10 px-4 py-2 w-full flex items-center justify-center">
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
                      className="lucide lucide-user-plus ml-2 h-4 w-4"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="19" x2="19" y1="8" y2="14"></line>
                      <line x1="22" x2="16" y1="11" y2="11"></line>
                    </svg>
                    تسجيل عضوية جديدة
                  </button>
                </Link>
              </div>
            </div>

            <div className="items-center p-4 border-t bg-gray-50 flex flex-col space-y-2">
              <div className="text-center pt-2">
                <p className="text-sm text-color-2">
                  عندما تقوم بتسجيل الدخول، فإنك توافق على
                </p>
                <div className="flex justify-center gap-2 text-sm text-primary">
                  <a href="#" className="hover:underline">
                    شروط الاستخدام
                  </a>
                  <span className="text-color-2">و</span>
                  <a href="#" className="hover:underline">
                    سياسة الخصوصية
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage