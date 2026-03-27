"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      {/* ===== NAVIGATION BAR ===== */}
      <nav className="sticky top-0 z-50 bg-navy shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-white font-bold text-lg sm:text-xl tracking-tight">
            Matt Urbanski | AquaGuard
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <a
              href="tel:+14705681681"
              className="text-white text-sm sm:text-base font-semibold hover:text-pink transition-colors hidden sm:inline"
            >
              (470) 568-1681
            </a>
            <Link
              href="/book"
              className="bg-pink hover:bg-pink-dark text-white font-bold text-sm sm:text-base px-4 sm:px-6 py-2 rounded-full transition-colors shadow-md"
            >
              Book Free Inspection
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-br from-navy via-navy-dark to-navy-light text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                Schedule Your Free Home Inspection with CFI Matthew Urbanski
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
                AquaGuard Foundation Solutions — Georgia&apos;s Trusted Expert in Foundation Repair, Basement Waterproofing, Crawl Space &amp; Concrete
              </p>
              <Link
                href="/book"
                className="inline-block bg-pink hover:bg-pink-dark text-white font-bold text-lg sm:text-xl px-8 sm:px-10 py-4 rounded-full shadow-xl transition-transform hover:scale-105"
              >
                Book My Free Inspection
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center"
            >
              <Image
                src="/images/matt-headshot.jpg"
                alt="Matthew Urbanski — Certified Field Inspector at AquaGuard Foundation Solutions"
                width={300}
                height={300}
                className="rounded-full border-4 border-white/30 shadow-2xl object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== HERO TESTIMONIAL CALLOUT ===== */}
      <section className="bg-navy text-white py-12 sm:py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <span className="text-pink text-6xl sm:text-8xl leading-none font-serif block mb-2">&ldquo;</span>
          <blockquote className="text-xl sm:text-2xl lg:text-3xl italic font-light leading-relaxed max-w-[700px] mx-auto">
            They have lifted my home&hellip; and lifted my spirits.
          </blockquote>
          <div className="mt-6 flex flex-col items-center gap-1">
            <div className="flex gap-1 text-yellow-400 text-xl">
              <span>&#9733;</span>
              <span>&#9733;</span>
              <span>&#9733;</span>
              <span>&#9733;</span>
              <span>&#9733;</span>
            </div>
            <span className="text-white/70 text-sm sm:text-base font-medium mt-1">Gary Rhone</span>
          </div>
          <span className="text-pink text-6xl sm:text-8xl leading-none font-serif block mt-2 rotate-180">&ldquo;</span>
        </motion.div>
      </section>

      {/* ===== TRUST BADGE ROW ===== */}
      <section className="bg-gray-light py-10 sm:py-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {[
              { icon: "🏆", label: "BBB A+ Rated Since 1998" },
              { icon: "🔍", label: "Free Inspection — No Obligation" },
              { icon: "🏠", label: "25+ Years Serving Georgia" },
              { icon: "🛡️", label: "Nationally Backed Transferable Warranties" },
              { icon: "📋", label: "Certified Field Inspector (CFI)" },
            ].map((badge) => (
              <motion.div
                key={badge.label}
                variants={fadeIn}
                className="bg-white rounded-xl shadow-md px-4 py-6 flex flex-col items-center gap-3"
              >
                <span className="text-3xl">{badge.icon}</span>
                <span className="text-navy font-semibold text-sm sm:text-base leading-tight">
                  {badge.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl sm:text-4xl font-extrabold text-navy text-center mb-12"
          >
            Our Services
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                title: "Foundation Repair",
                emoji: "🏗️",
                image: "/images/foundation-repair.jpg",
                description:
                  "Cracked walls, uneven floors, or sticking doors? Our foundation repair solutions stabilize and restore your home using industry-leading push piers, helical piers, and wall anchors — backed by transferable warranties.",
              },
              {
                title: "Basement Waterproofing",
                emoji: "💧",
                image: "/images/basement-before-after.jpg",
                description:
                  "Keep your basement dry and healthy with interior drainage systems, sump pumps, vapor barriers, and dehumidifiers. We eliminate water intrusion at the source for lasting protection.",
              },
              {
                title: "Crawl Space Encapsulation",
                emoji: "🔒",
                image: "/images/crawl-space-before-after.jpg",
                description:
                  "Seal out moisture, mold, and pests with full crawl space encapsulation. Our solutions include vapor barriers, drainage matting, dehumidifiers, and structural supports.",
              },
              {
                title: "Concrete Lifting",
                emoji: "⬆️",
                image: "/images/concrete-lifting.jpg",
                description:
                  "Sunken driveways, sidewalks, or patios? PolyRenewal foam injection lifts and levels concrete slabs quickly without the mess and cost of full replacement.",
              },
            ].map((service) => (
              <motion.div
                key={service.title}
                variants={fadeIn}
                className="bg-gray-light rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col"
              >
                <div className="relative w-full aspect-[3/2]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{service.emoji}</span>
                    <h3 className="text-xl font-bold text-navy">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    {service.description}
                  </p>
                  <Link
                    href="/book"
                    className="mt-4 inline-flex items-center text-pink font-semibold text-sm hover:underline"
                  >
                    Learn More &rarr;
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT MATTHEW SECTION ===== */}
      <section className="bg-gray-light py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-6 items-center justify-center">
              <Image
                src="/images/matt-headshot.jpg"
                alt="Matthew Urbanski headshot"
                width={300}
                height={300}
                className="rounded-2xl shadow-lg object-cover"
              />
              <Image
                src="/images/matt-credential-card.png"
                alt="Matthew Urbanski CFI credential card"
                width={400}
                height={250}
                className="rounded-2xl shadow-lg object-cover"
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-6">
                Meet Your Inspector — CFI Matthew Urbanski
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Matthew Urbanski is a Certified Field Inspector (CFI) with AquaGuard Foundation Solutions, a Groundworks company. With years of hands-on experience in foundation repair, basement waterproofing, crawl space encapsulation, and concrete lifting, Matt brings deep expertise and genuine care to every home he inspects across Georgia.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Matt is known for his thorough, transparent approach — walking homeowners through every finding, explaining options clearly, and never pressuring a decision. He takes the time to educate each client so they can make the best choice for their home and budget.
              </p>
              <blockquote className="border-l-4 border-pink pl-5 py-3 bg-white rounded-r-xl shadow-sm mb-6">
                <p className="text-navy italic text-lg font-medium">
                  &ldquo;I include every homeowner in each step of the inspection — no surprises, just honest solutions.&rdquo;
                </p>
              </blockquote>
              <div className="flex flex-col sm:flex-row gap-4 text-sm sm:text-base">
                <a
                  href="tel:+14705681681"
                  className="inline-flex items-center gap-2 text-navy font-semibold hover:text-pink transition-colors"
                >
                  <span>📞</span> (470) 568-1681
                </a>
                <a
                  href="mailto:matthew.urbanski@AquaGuard.net"
                  className="inline-flex items-center gap-2 text-navy font-semibold hover:text-pink transition-colors"
                >
                  <span>✉️</span> matthew.urbanski@AquaGuard.net
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== VIDEO SECTION ===== */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-8">
              Groundworks &amp; AquaGuard — Real Work, Real Results
            </h2>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.youtube.com/embed/rqCBGcumqjc"
                title="Groundworks & AquaGuard — Real Work, Real Results"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <a
              href="https://www.aquaguard.net/video-gallery/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 text-pink font-semibold text-lg hover:underline"
            >
              View Full Video Gallery &rarr;
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===== PHOTO GALLERY ===== */}
      <section className="bg-gray-light py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy text-center mb-4">
              Photo Gallery
            </h2>
            <p className="text-center text-gray-600 mb-10 text-lg">
              Real AquaGuard Work. Real Georgia Homes.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { src: "/images/basement-before-after.jpg", alt: "Basement waterproofing before and after" },
              { src: "/images/foundation-repair.jpg", alt: "Foundation repair project" },
              { src: "/images/crawl-space-before-after.jpg", alt: "Crawl space encapsulation before and after" },
              { src: "/images/concrete-lifting.jpg", alt: "Concrete lifting and leveling" },
              { src: "/images/sloping-floors.jpg", alt: "Sloping floors repair" },
              { src: "/images/sump-pump-install.jpg", alt: "Sump pump installation" },
              { src: "/images/services-collage.jpg", alt: "AquaGuard services collage" },
            ].map((photo) => (
              <motion.div
                key={photo.src}
                variants={fadeIn}
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full aspect-[3/2]"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== REVIEWS SECTION ===== */}
      <section className="bg-navy text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
              What Homeowners Are Saying
            </h2>
            <div className="flex items-center justify-center gap-2 text-yellow-400 text-2xl mb-2">
              <span>&#9733;</span>
              <span>&#9733;</span>
              <span>&#9733;</span>
              <span>&#9733;</span>
              <span className="text-yellow-400/70">&#9733;</span>
            </div>
            <p className="text-white/70 text-lg">4.8 stars across 1,500+ reviews</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Happy Homeowner",
                stars: 5,
                text: "Matt was very friendly and took his time explaining everything to me. He walked me through the entire inspection process, pointed out areas of concern, and showed me photos of what he found under my home. He put together a clear plan for repairing my back porch slab and made sure I understood every step before moving forward. No pressure at all — just honest, professional service.",
              },
              {
                name: "Verified Customer",
                stars: 5,
                text: "Matthew Urbanski developed a comprehensive, phased plan to address the foundation and waterproofing needs of our 100+ year-old home. He was incredibly thorough during the inspection, patient with all of our questions, and transparent about costs and timelines. We felt confident in his recommendations and appreciated that he tailored the plan to our budget. Highly recommend!",
              },
              {
                name: "Gary Rhone",
                stars: 5,
                text: "A+ FANTASTIC experience from start to finish! The team at AquaGuard was professional, courteous, and incredibly skilled. They have lifted my home and lifted my spirits. I was worried about the condition of my foundation for years, and Matt made the entire process easy to understand. I finally have peace of mind knowing my home is on solid ground. Thank you, AquaGuard!",
              },
            ].map((review) => (
              <motion.div
                key={review.name}
                variants={fadeIn}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 flex flex-col"
              >
                <div className="flex gap-1 text-pink text-lg mb-4">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <span key={i}>&#9733;</span>
                  ))}
                </div>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed flex-1 mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <span className="text-white/60 font-semibold text-sm">— {review.name}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mt-10"
          >
            <a
              href="https://www.aquaguard.net/about/reviews/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-pink hover:bg-pink-dark text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg"
            >
              Read More Reviews
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===== SOCIAL / LINKS SECTION ===== */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy text-center mb-12">
              Connect &amp; Learn More
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            {/* AquaGuard Links */}
            <motion.div variants={fadeIn}>
              <h3 className="text-xl font-bold text-navy mb-5">AquaGuard Foundation Solutions</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "AquaGuard Website", url: "https://www.aquaguard.net/", icon: "🌐" },
                  { label: "Facebook", url: "https://www.facebook.com/AquaGuardFoundationSolutions/", icon: "📘" },
                  { label: "Instagram", url: "https://www.instagram.com/aquaguardfoundationsolutions/", icon: "📸" },
                  { label: "LinkedIn", url: "https://www.linkedin.com/company/aquaguard-foundation-solutions/", icon: "💼" },
                  { label: "Video Gallery", url: "https://www.aquaguard.net/video-gallery/", icon: "🎬" },
                  { label: "Mike Rowe Series", url: "https://www.groundworks.com/mike-rowe/", icon: "🎤" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gray-light hover:bg-navy hover:text-white text-navy font-medium px-5 py-3 rounded-xl transition-colors shadow-sm"
                  >
                    <span className="text-xl">{link.icon}</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Groundworks Links */}
            <motion.div variants={fadeIn}>
              <h3 className="text-xl font-bold text-navy mb-5">Groundworks</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Groundworks Website", url: "https://www.groundworks.com/", icon: "🌐" },
                  { label: "AquaGuard Location Page", url: "https://www.groundworks.com/locations/aquaguard-foundation-solutions/", icon: "📍" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gray-light hover:bg-navy hover:text-white text-navy font-medium px-5 py-3 rounded-xl transition-colors shadow-sm"
                  >
                    <span className="text-xl">{link.icon}</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-navy-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
            {/* Contact */}
            <div>
              <p className="font-bold text-lg mb-2">Matthew Urbanski</p>
              <p className="text-white/70 text-sm mb-1">Certified Field Inspector — AquaGuard</p>
              <a
                href="tel:+14705681681"
                className="text-white hover:text-pink transition-colors block text-sm mt-2"
              >
                📞 (470) 568-1681
              </a>
              <a
                href="mailto:matthew.urbanski@AquaGuard.net"
                className="text-white hover:text-pink transition-colors block text-sm mt-1"
              >
                ✉️ matthew.urbanski@AquaGuard.net
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-5">
              <a
                href="https://www.facebook.com/AquaGuardFoundationSolutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-pink transition-colors text-2xl"
                aria-label="Facebook"
              >
                📘
              </a>
              <a
                href="https://www.instagram.com/aquaguardfoundationsolutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-pink transition-colors text-2xl"
                aria-label="Instagram"
              >
                📸
              </a>
              <a
                href="https://www.linkedin.com/company/aquaguard-foundation-solutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-pink transition-colors text-2xl"
                aria-label="LinkedIn"
              >
                💼
              </a>
              <a
                href="https://www.aquaguard.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-pink transition-colors text-2xl"
                aria-label="Website"
              >
                🌐
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-white/50 text-sm">
                &copy; 2025 Matthew Urbanski — AquaGuard Foundation Solutions
              </p>
              <p className="text-white/40 text-xs mt-1">A Groundworks Company</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
