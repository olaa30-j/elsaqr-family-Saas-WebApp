import FamilyPhotoCard from "./reusable/FamilyPhotoCard";

const AboutSection = () => {
  return (
    <section className="overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Text content */}
          <div className="lg:w-1/2 px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading">
              <span className="text-primary">جذورنا</span> وتاريخنا العريق
            </h2>
            <p className="text-lg text-color-2 mb-6">
              تمتد جذور عائلتنا لأكثر من مئة عام، حيث بدأت قصتنا في مدينة الرياض العريقة. على مر السنين، توسعت العائلة وانتشرت في مختلف أنحاء المملكة والخليج، محافظة على قيمها وتقاليدها الأصيلة.
            </p>
            <p className="text-lg text-color-2 mb-6">
              يعد تطبيق صندوق العائلة امتدادًا لتقليد الاجتماعات العائلية الدورية التي بدأت منذ عام 1980، والتي تهدف إلى الحفاظ على أواصر القرابة وتعزيز التواصل بين الأجيال المختلفة.
            </p>
            <p className="text-lg text-color-2">
              يضم الصندوق حاليًا أكثر من 150 عضوًا من مختلف الأعمار، ويسعى دائمًا إلى تطوير آليات العمل والتواصل بما يتناسب مع متطلبات العصر الحديث.
            </p>
          </div>

          {/* Photo collage */}
          <div className="lg:w-1/2 h-96">
            <div className="family-illustration relative w-full h-full px-2 mx-auto">
              {/* Large top-right photo */}
              <div className="absolute md:top-0 top-4 lg:right-3 left-3 lg:w-64 lg:h-64 w-44 h-48 z-10">
                <FamilyPhotoCard
                  src="https://res.cloudinary.com/dmhvfuuke/image/upload/v1748047250/family-gathering-1_iqrif7.jpg"
                  alt="تبادل المعايدات العائلية - 2022"
                  caption="تبادل المعايدات العائلية - 2022"
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px'
                  }}
                />
              </div>

              {/* Medium middle-left photo */}
              <div className="absolute top-10 right-3 lg:right-1/2 md:w-48 md:h-48 w-44 h-44  z-20">
                <FamilyPhotoCard
                  src="https://res.cloudinary.com/dmhvfuuke/image/upload/v1748047358/family-gathering-2_pxblwi.jpg"
                  alt="اللقاء الأسري - 2023"
                  caption="اللقاء الأسري - 2023"
                />
              </div>

              {/* Large bottom-right photo */}
              <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-56 h-56 z-30">
                <FamilyPhotoCard
                  src="https://res.cloudinary.com/dmhvfuuke/image/upload/v1748047295/family-tree-view_vj2qr9.jpg"
                  alt="توثيق تاريخ العائلة - 2023"
                  caption="توثيق تاريخ العائلة - 2023"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;