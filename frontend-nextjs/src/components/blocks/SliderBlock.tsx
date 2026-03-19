"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { SliderBlock as SliderBlockType, StrapiImage } from '@/src/types/strapi';
import { getStrapiMedia } from '@/src/lib/strapi';
import { BlockReveal } from './BlockReveal';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function SliderBlock({ block }: { block: SliderBlockType }) {
  const [selectedImage, setSelectedImage] = useState<StrapiImage | null>(null);

  if (!block.files || block.files.length === 0) return null;

  return (
    <BlockReveal>
      <div className="w-full my-10 max-w-5xl mx-auto">
        <Swiper
          modules={[EffectFade, Navigation, Pagination, Autoplay]}
          effect="fade"
          autoHeight={true}
          loop={true}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 7000, disableOnInteraction: true }}
          className="brutalist-border bg-slate-50 dark:bg-slate-900 group/swiper [&_.swiper-button-next]:z-50 [&_.swiper-button-prev]:z-50"
          onClick={(swiper) => {
            // Se houver um slide clicado, e o clique não foi em navegação/paginação
            if (typeof swiper.clickedIndex === 'number' && block.files[swiper.clickedIndex]) {
               setSelectedImage(block.files[swiper.clickedIndex]);
            }
          }}
        >
          {block.files.map((file: StrapiImage) => {
            const imageUrl = getStrapiMedia(file.url);
            if (!imageUrl) return null;
            return (
              <SwiperSlide key={file.id}>
                <figure className="w-full flex flex-col">
                  <div 
                    className="w-full relative cursor-pointer group/img flex items-center justify-center overflow-hidden bg-[#0f1115]"
                  >
                    <Image
                      src={imageUrl}
                      alt={file.alternativeText || file.name || 'Slider image'}
                      width={file.width || 1200}
                      height={file.height || 800}
                      className="w-full h-auto max-h-[75vh] object-contain transition-transform duration-700 group-hover/img:scale-105"
                    />
                    {/* Hover expand indicator */}
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                       <span className="opacity-0 group-hover/img:opacity-100 bg-white text-[#0f1115] px-4 py-2 font-bold text-xs uppercase tracking-widest transition-opacity duration-300 pointer-events-none shadow-[4px_4px_0px_0px_rgba(25,50,130,1)] border-2 border-[#0f1115]">
                         Ampliar Imagem
                       </span>
                    </div>
                  </div>
                  {file.caption && (
                    <figcaption className="p-4 bg-white text-xs font-bold text-[#0f1115] uppercase tracking-widest border-t-2 border-[#0f1115] text-center">
                      {file.caption}
                    </figcaption>
                  )}
                </figure>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Fullscreen Expansion Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-[rgb(25,50,130)] p-2 z-[110] transition-colors bg-[#0f1115]/50 rounded-none border-2 border-transparent hover:border-[rgb(25,50,130)]"
            onClick={() => setSelectedImage(null)}
            type="button"
            title="Fechar Modal"
          >
            <span className="sr-only">Fechar</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            className="w-full max-h-[90vh] overflow-y-auto flex flex-col items-center justify-start border-4 border-[#0f1115] bg-[#0f1115] scrollbar-thin scrollbar-thumb-[rgb(25,50,130)] hover:scrollbar-thumb-[rgb(25,50,130)] shadow-[8px_8px_0px_0px_rgba(25,50,130,1)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getStrapiMedia(selectedImage.url) as string}
              alt={selectedImage.alternativeText || selectedImage.name || 'Imagem ampliada'}
              width={selectedImage.width || 1920}
              height={selectedImage.height || 1080}
              className="w-full h-auto object-contain block"
              priority
            />
            {selectedImage.caption && (
              <div className="w-full bg-white text-[#0f1115] px-6 py-4 font-mono text-sm tracking-widest uppercase border-t-4 border-[#0f1115] text-center">
                {selectedImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </BlockReveal>
  );
}
