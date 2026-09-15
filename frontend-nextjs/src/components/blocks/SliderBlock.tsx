"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { SliderBlock as SliderBlockType, StrapiImage } from '@/src/types/strapi';
import { getStrapiMedia } from '@/src/lib/strapi';
import { MediaLightbox } from './MediaLightbox';

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

      <MediaLightbox media={selectedImage} onClose={() => setSelectedImage(null)} />
    </figure>
  );
}
