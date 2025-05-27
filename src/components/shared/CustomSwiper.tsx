// CustomSwiper.tsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCreative } from 'swiper/modules';

interface CustomSwiperProps {
  children: any[];
  className?: string;
}

const CustomSwiper: React.FC<CustomSwiperProps> = ({ children, className }) => {
  return (
    <div className={`relative group ${className}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCreative]}
        spaceBetween={20}
        slidesPerView={3}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        effect={'creative'}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ['-20%', 0, -1],
            opacity: 0.8,
            scale: 0.9
          },
          next: {
            translate: ['100%', 0, 0],
            scale: 0.9
          },
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
            centeredSlides: true
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
            centeredSlides: true
          },
        }}
        loop
        centeredSlides
        grabCursor
      >
        <SwiperSlide
          className="pb-6 transition-transform duration-300 hover:scale-105"
        >
          {children}
        </SwiperSlide>

        {/* Custom Navigation Arrows */}
        <div className="swiper-button-next hidden group-hover:block !text-primary !bg-white/80 !w-10 !h-10 !rounded-full !shadow-lg after:!text-lg"></div>
        <div className="swiper-button-prev hidden group-hover:block !text-primary !bg-white/80 !w-10 !h-10 !rounded-full !shadow-lg after:!text-lg"></div>
      </Swiper>
    </div>
  );
};

export default CustomSwiper;