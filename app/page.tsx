"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// TypeScript interfaces
interface LogoSliderProps {
  page: number;
  direction: number;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  onPaginate: (direction: number) => void;
}

interface SliderNavigationProps {
  onPrevClick: () => void;
  onNextClick: () => void;
  disabled: boolean;
}

interface ServiceCardProps {
  title: string;
  description: string;
  items: string[];
  imageSrc?: string;
}

interface QueryFormData {
  name: string;
  contactNumber: string;
  email: string;
  serviceType: string;
}

const imageGroups = [
  ['/gallery/1.jpg', '/gallery/2.jpg', '/gallery/3.jpg', '/gallery/4.jpg', '/gallery/5.jpg', '/gallery/6.jpg'],
  ['/gallery/7.jpg', '/gallery/8.jpg', '/gallery/9.jpg', '/gallery/10.jpg', '/gallery/11.jpg', '/gallery/12.jpg'],
  ['/gallery/13.jpg', '/gallery/14.jpg', '/gallery/15.jpg', '/gallery/16.jpg', '/gallery/17.jpg', '/gallery/18.jpg'],
  ['/gallery/19.jpg', '/gallery/20.jpg', '/gallery/21.jpg', '/gallery/22.jpg', '/gallery/23.jpg', '/gallery/24.jpg'],
];

const INITIAL_IMAGES = 3;
const LOAD_MORE_COUNT = 3;

// Update the hook to be more flexible with its types
const useIsInViewport = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return [ref, isIntersecting] as const;
};

const ImageModal = ({ image, onClose }: { image: string; onClose: () => void }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-[#262626] rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-1 text-white/80 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image container */}
          <div className="flex flex-col md:flex-row">
            <div className="relative aspect-square w-full md:w-[60%]">
              <Image
                src={image}
                alt="Selected image"
                fill
                className="object-cover"
                quality={100}
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>

            {/* Info section */}
            <div className="w-full md:w-[40%] p-4 border-t border-white/10 md:border-t-0 md:border-l">
              {/* User info */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/10"></div>
                <div className="text-white font-semibold">imlogolabs</div>
              </div>

              {/* Interaction icons */}
              <div className="flex items-center space-x-4 mb-4">
                <button className="text-white/80 hover:text-white">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className="text-white/80 hover:text-white">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
                <button className="text-white/80 hover:text-white">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ImageGallery = ({ selectedImage, setSelectedImage }: {
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 12;
  const allImages = imageGroups.flat();
  const totalPages = Math.ceil(allImages.length / imagesPerPage);

  const currentImages = useMemo(() => {
    const start = currentPage * imagesPerPage;
    return allImages.slice(start, start + imagesPerPage);
  }, [currentPage]);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="relative w-full px-4 sm:px-12">
      {/* Navigation Arrows */}
      <button
        onClick={prevPage}
        className="absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2 z-10 p-4 bg-yellow-500/90 hover:bg-yellow-500 rounded-full transition-colors hidden sm:block shadow-lg backdrop-blur-sm"
        aria-label="Previous page"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextPage}
        className="absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2 z-10 p-4 bg-yellow-500/90 hover:bg-yellow-500 rounded-full transition-colors hidden sm:block shadow-lg backdrop-blur-sm"
        aria-label="Next page"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image Grid */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {currentImages.map((image, index) => (
          <motion.div
            key={image}
            layoutId={image}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="aspect-square relative group"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden bg-black/20 border-2 border-white/10">
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                priority={index < 4}
                loading={index < 4 ? "eager" : "lazy"}
                quality={75}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-yellow-500 rounded-full"
                  onClick={() => setSelectedImage(image)}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* Mobile Navigation */}
      <div className="mt-6 flex justify-center gap-4 sm:hidden">
        <button
          onClick={prevPage}
          className="p-3 bg-yellow-500/90 hover:bg-yellow-500 rounded-full transition-colors shadow-lg backdrop-blur-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextPage}
          className="p-3 bg-yellow-500/90 hover:bg-yellow-500 rounded-full transition-colors shadow-lg backdrop-blur-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const SliderNavigation = ({ 
  onPrevClick, 
  onNextClick, 
  disabled 
}: SliderNavigationProps) => (
  <>
    <motion.button
      onClick={onPrevClick}
      disabled={disabled}
      className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 bg-yellow-500 rounded-full hover:bg-yellow-400 hidden sm:block disabled:opacity-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <motion.svg 
        className="w-6 h-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        whileHover={{ x: -2 }}
        transition={{ duration: 0.2 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </motion.svg>
    </motion.button>
    <motion.button
      onClick={onNextClick}
      disabled={disabled}
      className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 bg-yellow-500 rounded-full hover:bg-yellow-400 hidden sm:block disabled:opacity-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <motion.svg 
        className="w-6 h-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        whileHover={{ x: 2 }}
        transition={{ duration: 0.2 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </motion.svg>
    </motion.button>
  </>
);

// Social Icons Components
const MotionIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="text-white w-8 h-8"
  > 
    <path 
      d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    /> 
    <path 
      d="M15.75 8.25006H14.25C13.0074 8.25006 12 9.25742 12 10.5001V21.0001" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    /> 
    <path 
      d="M9 13.5032H15" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    /> 
  </svg>
);

const InstagramIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    className="text-white w-8 h-8"
  >
    <path 
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 2.617-4.771 6.979-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" 
      fill="currentColor"
    />
  </svg>
);

const WhatsAppIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    className="text-white w-8 h-8"
  >
    <path 
      d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" 
      fill="currentColor"
    />
  </svg>
);

// Service Components
const ServiceHeader = () => (
  <div className="text-center mb-8 sm:mb-16 space-y-4 px-4 sm:px-0">
    <p className="text-white max-w-3xl mx-auto font-bold text-xl sm:text-2xl">
      Let's get you started.
    </p>
    <h1 className="text-yellow-500 text-[1.5rem] sm:text-[clamp(2rem,5vw,2rem)] font-bold leading-tight">
      Have a great idea but unsure how to bring it to life?
    </h1>
    <p className="text-white/80 max-w-3xl mx-auto text-base sm:text-xl">
      We understand what it&apos;s like to have a really good idea and not knowing what to do or where to start. Or being stuck, unable to figure out what the next moves are for your business. That&apos;s where we come in!
    </p>
    <p className="text-white/80 max-w-3xl mx-auto text-base sm:text-xl">
      We&apos;ll kick it off with a discovery session and take it from there!
    </p>
  </div>
);

const ServiceCard = ({ title, description, items }: ServiceCardProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<QueryFormData>({
    name: '',
    contactNumber: '',
    email: '',
    serviceType: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    setIsFormOpen(false);
  };

  return (
    <div className="bg-black rounded-[16px] sm:rounded-[32px] p-4 sm:p-12 border-2 border-white/10 h-full relative service-card">
      <div className="flex flex-col space-y-4 sm:space-y-8">
        <motion.button
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 bg-yellow-500 rounded-full hover:bg-yellow-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M8.61097 18.5931L4.8 21L5.46774 16.7827C3.88371 15.3227 3 13.2947 3 11.0526C3 6.60529 6.47715 3 12 3C17.5228 3 21 6.60529 21 11.0526C21 15.5 17.5228 19.1053 12 19.1053C10.7622 19.1053 9.62714 18.9242 8.61097 18.5931Z" 
              stroke="black" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>

        <h2 className="text-2xl sm:text-5xl font-bold text-white">{title}</h2>
        <p className="text-white/60 text-base sm:text-xl leading-relaxed max-w-2xl">
          {description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="px-3 sm:px-4 py-2 rounded-full border border-white/20 text-white text-sm sm:text-base hover:bg-white hover:text-black hover:font-bold transition-all duration-200"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0"
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
            />

            {/* Form Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-white/20 shadow-2xl"
            >
              {/* Close Button */}
              <motion.button
                className="absolute -top-2 -right-2 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFormOpen(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Form Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Get in Touch</h3>
                <p className="text-white/60">We'll get back to you as soon as possible</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-white/30 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Contact Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="Your phone number"
                    className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-white/30 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Your email"
                    className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-white/30 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Service Type</label>
                  <select
                    required
                    className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  >
                    <option value="" className="bg-black">Select Service Type</option>
                    {items.map((service, idx) => (
                      <option key={idx} value={service} className="bg-black">
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <motion.button
                  type="submit"
                  className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors mt-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactSection = () => (
  <div className="relative overflow-hidden bg-black py-8 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-8">
      <div className="relative">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-[clamp(3rem,8vw,3rem)] font-bold text-white leading-tight mb-12"
        >
          Get in touch.
        </motion.h1>

        <div className="w-full h-[2px] bg-white/10 mb-12"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-16">
          <div className="space-y-12">
            <motion.a
              href="tel:+9607692107"
              className="text-lg sm:text-[clamp(1.2rem,3vw,2rem)] text-white/70 hover:text-white transition-colors block"
            >
              +960 7692107
            </motion.a>

            <motion.div className="space-y-2">
              <h3 className="text-white/40 uppercase text-xs sm:text-sm tracking-wider">LOCATION</h3>
              <address className="text-white/70 not-italic text-base sm:text-lg leading-relaxed">
                Ma.Vagaaru, 5B, 5th Floor,<br />
                Buruzu Magu, Male&apos;, 20141<br />
                Maldives.
              </address>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Image
            src="/myphotos/imlogo.png"
            alt="ImlogoLabs Logo"
            width={50}
            height={50}
            className="rounded-full w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
          />
          <div>
            <h1 className="text-white text-lg sm:text-2xl font-bold tracking-tight">imlogolabs</h1>
            <p className="text-gray-400 text-sm sm:text-base">Graphic Designer</p>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <a 
            href="https://wa.me/9607692107" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-white/80 transition-colors"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24"
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="currentColor"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </a>
          <a 
            href="https://www.instagram.com/imlogolabs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-white/80 transition-colors"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24"
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="currentColor"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 2.617-4.771 6.979-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" 
              fill="currentColor"
            />
          </svg>
          </a>
          <a 
            href="https://www.facebook.com/imlogolabs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-white/80 transition-colors"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24"
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="currentColor"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </header>
);

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <Header />
      <div className="min-h-screen w-full bg-black pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="relative">
            <ImageGallery 
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
          </div>

          <div className="md:col-span-3 mt-8 sm:mt-16">
            <ServiceHeader />
            <div className="grid grid-cols-1 gap-6 sm:gap-8">
              <ServiceCard
                title="Design"
                description="With a careful eye for detail and boundless creativity, we transform visions into captivating realities. Every line, color, and font choice tells a story—yours—crafted to stand out and connect."
                items={[
                  "Branding & Identity Design",
                  "Product Design",
                  "Motion Design & Animation",
                  "UI/UX",
                  "Iconography & Type Design",
                  "Graphic Design",
                  "Interior Design",
                  "Architectural Visualization",
                  "Campaign Design",
                  "Print Design",
                  "Commercials"
                ]}
              />
              
              <ServiceCard
                title="Technology"
                description="Our development process is all about bringing together form and function. We love to tinker and play around, but at the end of the day, we promise solid building practices and software that are super smart, scalable, and secure."
                items={[
                  "Web Development",
                  "Mobile app development",
                  "E-commerce solutions",
                  "CMS Development",
                  "Custom software development",
                  "Technical Consulting & Support",
                  "AR/VR Experiences"
                ]}
              />
              
              <ServiceCard
                title="Social"
                description="Being social is what gets people's attention. With trends changing every other minute, you really do need a whole team who knows your brand inside out to create the right kind of content."
                items={[
                  "Social Media Management",
                  "Social Media Advertising",
                  "Social Media Content Creation",
                  "Influencer Marketing",
                  "Video Content",
                  "Photo Content",
                  "Ads"
                ]}
              />
            </div>
          </div>
        </div>
        <ContactSection />
      </div>
    </>
  );
}
