import { useEffect, useState } from "react";
import PrivacyPolicyPopup from "./PrivacyPolicyPopup";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("privacyPopupSeen");
    if (!hasSeenPopup) {
      setIsOpen(true);
      localStorage.setItem("privacyPopupSeen", "true");
    }
  }, []);

  return (
    <footer className="py-12 bg-gray-50 mb-10">
      <div className="container mx-auto px-6">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="https://res.cloudinary.com/dmhvfuuke/image/upload/v1748029147/family-logo_z54fug.png"
              alt="شعار عائلة الصقر الدهمش"
              width={80}
              height={80}
              loading="lazy"
              className="h-20 w-auto object-contain"
            />
          </div>

          {/* Copyright text */}
          <p className="text-color-2 mb-4">
            © 2025 عائلة الصقر الدهمش - تطبيق صندوق العائلة - جميع الحقوق محفوظة
          </p>

          {/* Developer credit */}
          <p className="text-sm text-color-2/70">
            تم تطويره بكل حب ❤️ لأفراد عائلتنا
          </p>
        </div>
      </div>
      <div className="items-center mt-4 border-t bg-gray-50 flex flex-col space-y-2">
        <div className="text-center pt-2">
          <div className="flex justify-center gap-2 text-sm text-primary">
            <p className="hover:underline">
              شروط الاستخدام
            </p>
            <span className="text-color-2">و</span>
            <button onClick={() => setIsOpen(true)} className="hover:underline">
              سياسة الخصوصية
            </button>
          </div>
        </div>
      </div>
      {
        isOpen && (
          <PrivacyPolicyPopup closePopup={() => setIsOpen(false)} />
        )
      }

    </footer >
  );
};

export default Footer;