const Footer = () => {
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
    </footer>
  );
};

export default Footer;