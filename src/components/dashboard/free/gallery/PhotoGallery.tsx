
export default function PhotoGallery() {
  return (
    <main className="flex-1 overflow-y-auto pb-16">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera ml-2 h-6 w-6 text-primary">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
              <h2 className="text-xl font-heading font-bold">معرض الصور</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-4 w-4">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                <span>إنشاء ألبوم</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[{
              title: "حفل",
              src: "/uploads/photos/43efe011-6f21-4e6f-8c13-2a15ca6facaf.jpg",
              user: 1
            }, {
              title: "عربي",
              src: "/uploads/photos/1a6bc798-48e0-46f5-b34b-8a769a7b03a3.jpg",
              user: 2
            }].map((album, index) => (
              <div key={index} className="rounded-lg overflow-hidden bg-white shadow cursor-pointer hover:shadow-md transition-shadow">
                <div className="h-48 bg-muted relative">
                  <img src={album.src} alt={album.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-lg truncate">{album.title}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-4 w-4 ml-1">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>بواسطة: {album.user}</span>
                    </div>
                    <span>الثلاثاء، ٢٤ شوال ١٤٤٦ هـ</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/30 h-full flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors" style={{ minHeight: 250 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-12 w-12 text-muted-foreground mb-2">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              <p className="text-muted-foreground font-medium">إنشاء ألبوم جديد</p>
            </div>
          </div>

          <footer className="py-4 border-t border-muted mt-8">
            <div className="text-center text-xs text-muted-foreground">
              <p>© 2025 عائلة الصقر الدهمش - جميع الحقوق محفوظة</p>
              <div className="flex justify-center gap-4 mt-1">
                <a href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</a>
                <a href="/terms" className="hover:text-primary transition-colors">شروط الاستخدام</a>
                <a href="/contact" className="hover:text-primary transition-colors">اتصل بالإدارة</a>
              </div>
              <p className="mt-1">الإصدار 1.0.0</p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}