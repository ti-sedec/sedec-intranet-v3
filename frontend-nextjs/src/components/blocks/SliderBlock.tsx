"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { SliderBlock as SliderBlockType, StrapiImage } from '@/src/types/strapi';
import { getStrapiMedia } from '@/src/lib/strapi';

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
    <figure className="m-0">
      <div className="relative rounded-[5px] overflow-hidden border border-[var(--color-border)]">
        <span className="absolute top-3 left-3 z-10 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] bg-[var(--color-ink)] text-white px-2 py-1 rounded-[3px]">
          Galeria
        </span>
        <Swiper
          modules={[EffectFade, Navigation, Pagination, Autoplay]}
          effect="fade"
          autoHeight={true}
          observer={true}
          observeParents={true}
          loop={true}
          navigation={true}
          pagination={{ clickable: true, type: 'fraction' }}
          autoplay={{ delay: 7000, disableOnInteraction: true }}
          className="bg-[var(--color-surface-alt)]"
          onClick={(swiper) => {
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
                <div
                  className="relative w-full cursor-pointer flex items-center justify-center overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  <Image
                    src={imageUrl}
                    alt={file.alternativeText || file.name || 'Imagem da galeria'}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {selectedImage?.caption && (
        <figcaption className="mt-2.5 text-[13px] text-[var(--color-faint)] leading-relaxed">
          {selectedImage.caption}
        </figcaption>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-[var(--color-accent)] p-2 z-[110]"
            onClick={() => setSelectedImage(null)}
            type="button"
            title="Fechar"
          >
            <span className="sr-only">Fechar</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="w-full max-h-[90vh] overflow-y-auto flex flex-col items-center rounded-md bg-[var(--color-ink)]"
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
              <div className="w-full bg-white text-[var(--color-ink)] px-6 py-4 text-sm text-center">
                {selectedImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </figure>
  );
}
