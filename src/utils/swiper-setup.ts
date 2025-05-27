import { Navigation, Pagination, Autoplay, EffectCreative } from 'swiper/modules';

export const swiperModules = [Navigation, Pagination, Autoplay, EffectCreative];

export const swiperBreakpoints = {
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
};

export const creativeEffectConfig = {
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
};