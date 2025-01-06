"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ThemeToggle } from './components/ThemeToggle'

// Add interface for ServiceCard props
interface ServiceCardProps {
  title: string;
  description: string;
  items: string[];
  imageSrc?: string; // Optional since some cards might not have images
}

// First, let's add a new interface for the form data
interface QueryFormData {
  name: string;
  contactNumber: string;
  email: string;
  serviceType: string;
}

const ImageCarousel = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 8;
  const images = [
    '/gallery/image1.jpg',
    '/gallery/image2.jpg',
    '/gallery/image3.jpg',
    '/gallery/image4.jpg',
    '/gallery/image5.jpg',
    '/gallery/image6.jpg',
    '/gallery/image7.jpg',
    '/gallery/image8.jpg',
    // Add more images as needed
  ];
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const getCurrentImages = () => {
    const result = [];
    for (let i = 0; i < imagesPerPage; i++) {
      const index = (currentPage * imagesPerPage + i) % images.length;
      result.push(images[index]);
    }
    return result;
  };

  const currentImages = getCurrentImages();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 10000);

    return () => clearInterval(timer);
  }, [totalPages]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 auto-rows-min">
      <AnimatePresence mode="popLayout">
        {currentImages.map((image, index) => (
          <motion.div
            key={`${currentPage}-${index}`}
            className={`${
              selectedImage === image 
                ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' 
                : 'col-span-1'
            } aspect-square cursor-pointer relative`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              transition: {
                duration: 0.2,
                delay: index * 0.05,
                ease: "easeOut"
              }
            }}
            exit={{ opacity: 0, x: -20 }}
            layoutId={`image-${index}`}
            onClick={() => setSelectedImage(selectedImage === image ? null : image)}
          >
            <motion.div 
              className="w-full h-full bg-black border-2 border-white/10 rounded-3xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                priority={index < 4}
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

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
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" 
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

// New components for services
const ServiceHeader = () => (
  <div className="text-center mb-16 space-y-4">
        <p className="text-white max-w-3xl mx-auto font-bold text-2xl">
      Services
    </p>
    <h1 className="text-yellow-500 text-[clamp(2rem,5vw,2rem)] font-bold leading-tight">
      Have a great idea but unsure how to bring it to life? <br />
    </h1>
    <p className="text-white/80 max-w-3xl mx-auto text-xl">
      We understand what it's like to have a really good idea and not knowing what to do or where to start. Or being stuck, unable to figure out what the next moves are for your business. That's where we come in!
    </p>
    <p className="text-white/80 max-w-3xl mx-auto text-xl">
      We'll kick it off with a discovery session and take it from there!
    </p>
  </div>
);

const ServiceContentCard = ({ title, description, items }: Omit<ServiceCardProps, 'imageSrc'>) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<QueryFormData>({
    name: '',
    contactNumber: '',
    email: '',
    serviceType: ''
  });

  // Add useEffect to handle clicks outside the card
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isFormOpen && !target.closest('.service-card')) {
        setIsFormOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFormOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    setIsFormOpen(false);
  };

  return (
    <div className="bg-black rounded-[32px] p-12 border-2 border-white/10 h-full relative service-card">
      <div className="flex flex-col space-y-8">
        <h2 className="text-5xl font-bold text-white">{title}</h2>
        <p className="text-white/60 text-xl leading-relaxed max-w-2xl">
          {description}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {items.map((item: string, index: number) => (
            <div
              key={index}
              className="px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white hover:text-black hover:font-bold transition-all duration-200"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Chat Icon Button */}
        <motion.button
          className="absolute bottom-6 right-6 p-3 bg-yellow-500 rounded-full hover:bg-yellow-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          > 
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M8.61097 18.5931L4.8 21L5.46774 16.7827C3.88371 15.3227 3 13.2947 3 11.0526C3 6.60529 6.47715 3 12 3C17.5228 3 21 6.60529 21 11.0526C21 15.5 17.5228 19.1053 12 19.1053C10.7622 19.1053 9.62714 18.9242 8.61097 18.5931Z" 
              stroke="black" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            /> 
            <path 
              d="M8.01 11H8" 
              stroke="black" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            /> 
            <path 
              d="M12.01 11H12" 
              stroke="black" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            /> 
            <path 
              d="M16.01 11H16" 
              stroke="black" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            /> 
          </svg>
        </motion.button>
      </div>

      {/* Query Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-[32px] p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-2 bg-black/50 rounded-full border border-white/20 text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <input
                  type="tel"
                  placeholder="Contact Number"
                  className="w-full px-4 py-2 bg-black/50 rounded-full border border-white/20 text-white"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 bg-black/50 rounded-full border border-white/20 text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <select
                  className="w-full px-4 py-2 bg-black/50 rounded-full border border-white/20 text-white"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                >
                  <option value="">Select Service Type</option>
                  {items.map((service, idx) => (
                    <option key={idx} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-center pt-4">
                <motion.button
                  type="submit"
                  className="px-8 py-2 bg-black text-white rounded-full font-bold text-sm hover:bg-white hover:text-black transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Submit Query
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServiceVisualCard = () => (
  <motion.div 
    className="bg-black rounded-[32px] border-2 border-white/10 h-full relative overflow-hidden"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
  >
    <Image
      src="/path-to-your-image.jpg"
      alt="Service visual"
      fill
      className="object-cover"
      priority
    />
  </motion.div>
);

const ServiceCard = (props: ServiceCardProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
    <div className="md:col-span-2">
      <ServiceContentCard 
        title={props.title}
        description={props.description}
        items={props.items}
      />
    </div>
    <div className="md:col-span-1">
      <ServiceVisualCard />
    </div>
  </div>
);

const ContactSection = () => (
  <div className="relative overflow-hidden bg-black py-24 px-8">
    <div className="max-w-7xl mx-auto">
      {/* Main content */}
      <div className="relative">
        {/* Header */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[clamp(3rem,8vw,3rem)] font-bold text-white leading-none mb-12"
        >
          Get in touch.
        </motion.h1>

        {/* Contact info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            {/* Email */}
            <motion.a
              href="mailto:creative@illustratedmaldives.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group block"
            >
              <div className="text-[clamp(1.5rem,4vw,2.5rem)] text-red-500 font-medium flex items-center gap-4">
                creative@illustratedmaldives.com
                <motion.span 
                  className="text-2xl"
                  initial={{ x: 0 }}
                  whileHover={{ x: 8 }}
                >
                  ↗
                </motion.span>
              </div>
            </motion.a>

            {/* Phone */}
            <motion.a
              href="tel:+9603009001"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[clamp(1.2rem,3vw,2rem)] text-white/70 hover:text-white transition-colors"
            >
              +960 7692107
            </motion.a>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-2"
            >
              <h3 className="text-white/40 uppercase text-sm tracking-wider">Location</h3>
              <address className="text-white/70 not-italic text-lg leading-relaxed">
                Ma.Vagaaru, 5B, 5th Floor,<br />
                Buruzu Magu, Male', 20141<br />
                Maldives.
              </address>
            </motion.div>
          </div>

          {/* Social Links */}
          <div className="lg:justify-self-end self-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-6"
            >
              {[
                { name: 'Facebook', href: '#' },
                { name: 'Instagram', href: '#' },
                { name: 'LinkedIn', href: '#' },
                { name: 'Twitter', href: '#' },
                { name: 'YouTube', href: '#' }
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ y: -4 }}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <span className="sr-only">{social.name}</span>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors">
                    <span className="text-sm">{social.name[0]}</span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Header = () => (
  <div className="w-full bg-white dark:bg-black transition-colors">
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/10 dark:border-white/10 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        {/* Left side - Logo and title */}
        <div className="flex items-center gap-6">
          <div className="relative w-8 h-8">
            <Image
              src="/myphotos/imlogo.png"
              alt="Illustrated Maldives"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-black/90 dark:text-white/90 text-sm font-medium">
            Illustrated Maldives
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          {[
            { Icon: MotionIcon, label: 'facebook' },
            { Icon: InstagramIcon, label: 'Instagram' },
            { Icon: WhatsAppIcon, label: 'WhatsApp' }
          ].map((social) => (
            <motion.a
              key={social.label}
              href="#"
              whileHover={{ scale: 1.1 }}
              className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
            >
              <social.Icon />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.nav>

    {/* Hero section */}
    <div className="min-h-screen flex items-center pt-32">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl space-y-8"
        >
          <h1 className="text-white dark:text-black text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.1]">
            Crafting distinctive logos & brand identities
          </h1>
          
          <p className="text-white/60 dark:text-white/60 text-xl leading-relaxed">
            We transform ideas into memorable visual experiences that leave lasting impressions.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-white dark:bg-black text-black dark:text-white rounded-full font-medium text-sm hover:bg-white/90 dark:hover:bg-black/90 transition-colors"
          >
            Start a Project
          </motion.button>
        </motion.div>
      </div>
    </div>
  </div>
);

const SocialLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.a
    href={href}
    className="text-white/80 dark:text-white/80 hover:text-white dark:hover:text-white transition-colors"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.a>
);

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 8;
  const images = Array.from({ length: 20 }, (_, i) => `/image-${i + 1}.jpg`);
  const totalPages = Math.ceil(images.length / imagesPerPage);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black transition-colors">
      {/* New header bar */}
      <div className="w-full bg-white dark:bg-black px-8 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left side - Logo and title */}
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[#4A1D1F]">
              <Image
                src="/myphotos/imlogo.png"
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-black dark:text-white">imlogolabs</h2>
              <p className="text-gray-400 text-xl">Graphic Designer</p>
            </div>
          </div>

          {/* Right side - Social links */}
          <div className="flex items-center gap-6">
            {/* WhatsApp Icon */}
            <SocialLink href="#">
              <WhatsAppIcon />
            </SocialLink>
            {/* Facebook Icon */}
            <SocialLink href="#">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-black dark:text-white w-8 h-8"
              > 
                <path d="M12 2.53906C17.5229 2.53906 22 7.01621 22 12.5391C22 17.5304 18.3431 21.6674 13.5625 22.4176V15.4297H15.8926L16.3359 12.5391L13.5625 12.5387V10.6632C13.5625 10.657 13.5625 10.6509 13.5626 10.6447C13.5626 10.6354 13.5628 10.6262 13.5629 10.6169C13.578 9.84259 13.9742 9.10156 15.1921 9.10156H16.4531V6.64062C16.4531 6.64062 15.3087 6.44492 14.2146 6.44492C11.966 6.44492 10.4842 7.78652 10.4386 10.2193C10.4379 10.2578 10.4375 10.2965 10.4375 10.3355V12.5387H7.89844V15.4293L10.4375 15.4297V22.4172C5.65686 21.667 2 17.5304 2 12.5391C2 7.01621 6.47715 2.53906 12 2.53906Z" fill="currentColor"/>
              </svg>
            </SocialLink>
            {/* Instagram Icon */}
            <SocialLink href="#">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24"
                className="text-black dark:text-white w-8 h-8"
              >
                <path 
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" 
                  fill="currentColor"
                />
              </svg>
            </SocialLink>
          </div>
        </div>
      </div>

      {/* Rest of your content */}
      <div className="max-w-7xl mx-auto">
        <div className="md:col-span-3">
          <ImageCarousel />
        </div>

        {/* Services Section */}
        <div className="md:col-span-3 mt-16">
          <ServiceHeader />
          <div className="grid grid-cols-1 gap-8">
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
              imageSrc="/path-to-design-image.jpg"
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
              imageSrc="/path-to-tech-image.jpg"
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
              imageSrc="/path-to-social-image.jpg"
            />
          </div>
        </div>
      </div>
      <ContactSection />
    </div>
  );
}
