import { ChevronDownIcon, ChevronRightIcon, UserPlusIcon } from '../../views/home/Home';
import Button from '../ui/Button';

const MainSection = () => {
  return (
    <section className="hero-section relative lg:h-screen md:h-[60vh]  h-screen flex flex-col items-center justify-center text-center px-6 py-4 overflow-hidden bg-gradient-to-b from-primary/10 to-background">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)' }}
        ></div>
        <div
          className="absolute top-1/4 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-md"
          style={{ transform: 'translateX(-334.798px)' }}
        ></div>
        <div
          className="absolute top-3/4 w-full h-2 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent blur-md"
          style={{ transform: 'translateX(778.142px)' }}
        ></div>
      </div>

      {/* Main content */}
      <div className="hero-content relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center justify-around max-h-[90vh]">
        <div className="w-full mb-2">
          <div className="relative w-32 h-32 mx-auto">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
                transform: 'scale(1.09963)'
              }}
            ></div>
            <div
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.2), transparent, transparent)',
                transform: 'rotate(78.096deg)'
              }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border-2 border-primary/20"
              style={{ transform: 'rotate(39.048deg)' }}
            ></div>
            <div
              className="absolute inset-4 rounded-full border-2 border-amber-500/30"
              style={{ transform: 'rotate(121.428deg)' }}
            ></div>
            <div
              className="absolute inset-10 rounded-full bg-gradient-to-br from-primary/20 to-amber-500/20 blur-sm"
              style={{ transform: 'scale(1.08098)' }}
            ></div>
            <div className="absolute inset-16 rounded-full bg-white/20"></div>

            <div className="relative w-full h-full flex items-center justify-center" style={{ transform: 'rotate(2.13127deg)' }}>
              {/* Small dots around the circle */}
              {[
                { opacity: 0, transform: 'translateX(0.912646px)' },
                { opacity: 0, transform: 'translateX(32.3497px) translateY(56.0313px)' },
                { opacity: 0, transform: 'translateX(-30.3108px) translateY(52.4998px)' },
                { opacity: 0, transform: 'translateX(-51.5122px) translateY(6.30843e-15px)' },
                { opacity: 0, transform: 'translateX(-19.1051px) translateY(-33.091px)' },
                { opacity: 0, transform: 'translateX(11.7218px) translateY(-20.3027px)' },
              ].map((style, index) => (
                <div
                  key={index}
                  className="absolute w-2 h-2 bg-white rounded-full shadow-glow"
                  style={style}
                ></div>
              ))}

              {/* Main logo image */}
              <div className="rounded-full overflow-hidden border-4 border-white/30 shadow-2xl" style={{ boxShadow: 'rgba(255, 255, 255, 0.4) 0px 0px 30px' }}>
                <div className="relative w-28 h-28 overflow-hidden rounded-full">
                  <div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent z-10 mix-blend-overlay"
                    style={{ left: '30.16%', top: '30.16%' }}
                  ></div>
                  <img
                    loading='lazy'
                    src="https://res.cloudinary.com/dmhvfuuke/image/upload/v1748029147/family-logo_z54fug.png"
                    alt="شعار عائلة الصقر الدهمش"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground font-heading tracking-tight">
            <span className="text-primary inline-block">عائلة الصقر الدهمش</span>
            <br />
            <span className="text-amber-600 inline-block">تطبيق صندوق العائلة</span>
          </h1>
          <p className="text-sm md:text-lg text-color-2 mb-3 max-w-2xl mx-auto">
            منصة متكاملة لإدارة شؤون العائلة، تعزز الترابط وتيسر التواصل بين الأجيال
            <br />
            <span className="text-primary/80 font-medium">من شجرة العائلة التفاعلية إلى إدارة اللجان والفعاليات ومشاركة الذكريات</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
          {/* Login button */}
          <Button
            buttonLink='/login'
            variant="primary"
            extraStyle="group relative overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-primary/90"
          >
            <div className="absolute inset-0 overflow-hidden opacity-30">
              {[
                { left: '2.16655%', top: '34.7717%', transform: 'translateX(-1.30328px) translateY(0.222573px) scale(1.11712)' },
                { left: '84.9418%', top: '41.6151%', transform: 'translateX(-0.932392px) translateY(-3.2141px) scale(1.44461)' },
                { left: '60.8881%', top: '61.7205%', transform: 'translateX(-2.72035px) translateY(-3.1172px) scale(1.09259)' },
                { left: '43.4669%', top: '45.7767%', transform: 'translateX(8.07924px) translateY(5.72986px) scale(1.14784)' },
              ].map((style, index) => (
                <div
                  key={index}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={style}
                ></div>
              ))}
            </div>
            <div
              className="relative z-[100] bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
              style={{ transform: 'translateX(-62.0875%)' }}
            ></div>
            <span className="relative z-10">تسجيل الدخول</span>
            <span className="h-5 w-5 relative z-10">
              <ChevronRightIcon className="h-5 w-5" />
            </span>
            <span className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-400"></span>
          </Button>

          {/* Register button */}
          <Button
            variant="amber"
            extraStyle="group relative overflow-hidden bg-gradient-to-r from-amber-600/90 via-amber-500/85 to-amber-600/90"
            buttonLink='/register'
          >
            <div className="absolute inset-0 overflow-hidden opacity-30">
              {[
                { left: '0.172257%', top: '85.0442%', transform: 'translateX(-0.916248px) translateY(-6.06818px) scale(1.45326)' },
                { left: '52.4247%', top: '58.5324%', transform: 'translateX(-2.52273px) translateY(0.596754px) scale(0.27556)' },
                { left: '48.2021%', top: '44.9012%', transform: 'translateX(0.11437px) translateY(3.25552px) scale(1.39122)' },
                { left: '72.9055%', top: '72.4766%', transform: 'translateX(4.27733px) translateY(-3.55839px) scale(0.647563)' },
              ].map((style, index) => (
                <div
                  key={index}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={style}
                ></div>
              ))}
            </div>
            <div
              className="relative z-[100] bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
              style={{ transform: 'translateX(-62.0875%)' }}
            ></div>
            <span className="relative z-10">تسجيل عضوية جديدة</span>
            <span className="mx-2 h-5 w-5 relative z-10" style={{ transform: 'scale(1.04784)' }}>
              <UserPlusIcon className="h-5 w-5" />
            </span>
            <span className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-400"></span>
          </Button>

          {/* Discover more button */}
          <a href="#more">
            <Button
              variant="outline"
              extraStyle="group border-2 relative overflow-hidden"
              buttonLink=''
            >
              <span className="absolute inset-0 border-2 border-primary/30 rounded-md opacity-0 group-hover:opacity-100" style={{ transform: 'scale(1.06166)' }}></span>
              <span className="relative z-10 text-primary/90 group-hover:text-primary">اكتشف المزيد</span>
              <span className="mx-2 inline-block relative z-10" style={{ transform: 'translateY(2.4762px)' }}>
                <ChevronDownIcon className="h-5 w-5" />
              </span>
              <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </a>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center" style={{ opacity: 0.9 }}>
        <a href="#explore">
          <div
            className="cursor-pointer p-2 rounded-full bg-primary/10 backdrop-blur-sm"
            style={{ transform: 'translateY(6.16591px)' }}
          >
            <ChevronDownIcon className="text-primary" size={28} />
          </div>
        </a>
      </div>
    </section>
  );
};




export default MainSection;