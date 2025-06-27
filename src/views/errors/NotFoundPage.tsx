import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "الصفحة غير موجودة | تطبيق صندوق أسرة صقر الدهمش";
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 text-center pb-20">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl border border-primary overflow-hidden">
        {/* المحتوى الرئيسي */}
        <div className="p-8 space-y-6">
          {/* أيقونة */}
          <div className="mx-auto w-24 h-24">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-400">404</h1>
          </div>

          {/* الرسالة */}
          <div className="pt-4">
            <h2 className="text-3xl font-bold text-primary dark:text-white mb-2">
              الصفحة غير موجودة
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
            </p>
          </div>

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={goToHome}
              className="px-3 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex-1 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              الصفحة الرئيسية
            </button>
            <button
              onClick={handleReload}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex-1 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              إعادة تحميل
            </button>
          </div>
        </div>

        {/* تذييل الصفحة */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            تطبيق صندوق أسرة صقر الدهمش © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;