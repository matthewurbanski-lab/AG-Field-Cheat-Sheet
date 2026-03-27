"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TRUST_BADGES, SERVICES, REVIEWS, SOCIAL_LINKS, GALLERY_IMAGES } from "@/lib/constants";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
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

      {/* ===== SECTION 1 — HERO ===== */}
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

      {/* ===== SECTION 2 — HERO TESTIMONIAL CALLOUT ===== */}
      <section className="bg-gradient-to-b from-navy-dark to-navy text-white py-12 sm:py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="max-w-[700px] mx-auto px-6 text-center"
        >
          <span className="text-pink text-6xl sm:text-8xl leading-none font-serif block mb-2">&ldquo;</span>
          <blockquote className="text-xl sm:text-2xl lg:text-3xl italic font-light leading-relaxed">
            They have lifted my home&hellip; and lifted my spirits.
          </blockquote>
          <div className="mt-6 flex flex-col items-center gap-1">
            <div className="flex gap-1 text-yellow-400 text-xl">
              {[...Array(5)].map((_, i) => (
                <span key={i}>&#9733;</span>
              ))}
            </div>
            <span className="text-white/70 text-sm sm:text-base font-medium mt-1">
              — Gary Rhone | Verified Google Review
            </span>
          </div>
          <span className="text-pink text-6xl sm:text-8xl leading-none font-serif block mt-2 rotate-180">&ldquo;</span>
        </motion.div>
      </section>

      {/* ===== SECTION 3 — TRUST BADGE ROW ===== */}
      <section className="bg-navy py-8 sm:py-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {TRUST_BADGES.map((badge) => (
              <motion.div
                key={badge.label}
                variants={fadeIn}
                className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-4 flex flex-col items-center gap-2"
              >
                <span className="text-2xl sm:text-3xl">{badge.icon}</span>
                <span className="text-white font-semibold text-xs sm:text-sm leading-tight">
                  {badge.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== SECTION 4 — SERVICES ===== */}
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
            {SERVICES.map((service) => (
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
                    <span className="text-2xl">{service.icon}</span>
                    <h3 className="text-xl font-bold text-navy">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    {service.description}
                  </p>
                  <Link
                    href="/book"
                    className="mt-4 inline-flex items-center text-pink font-semibold text-sm hover:underline"
                  >
                    Book Inspection &rarr;
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 5 — ABOUT MATTHEW ===== */}
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
                CFI Matthew Urbanski is a Certified Field Inspector with AquaGuard Foundation Solutions, a Groundworks Company. Matthew conducts thorough inspections of foundations, basements, crawl spaces, and concrete — always including the homeowner in every step of the process. His approach is simple: honest answers, no pressure, and a plan tailored to your home and your budget.
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
                  📞 (470) 568-1681
                </a>
                <a
                  href="mailto:matthew.urbanski@AquaGuard.net"
                  className="inline-flex items-center gap-2 text-navy font-semibold hover:text-pink transition-colors"
                >
                  ✉️ matthew.urbanski@AquaGuard.net
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 6 — WHY CHOOSE MATT (VETERAN) ===== */}
      <section className="relative bg-navy text-white py-16 sm:py-24 overflow-hidden">
        {/* Subtle flag texture overlay */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjEiPjxwYXRoIGQ9Ik0wIDBoNDB2MUgwek0wIDEwaDQwdjFIMHpNMCAyMGg0MHYxSDB6TTAgMzBoNDB2MUgweiIvPjwvZz48L3N2Zz4=')]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center"
          >
            {/* Photo column */}
            <motion.div variants={fadeIn} className="lg:col-span-2 flex justify-center">
              <div className="relative">
                <Image
                  src="/images/matt-headshot.jpg"
                  alt="Matthew Urbanski — U.S. Air Force Veteran"
                  width={350}
                  height={350}
                  className="rounded-2xl shadow-2xl object-cover border-2 border-white/20"
                />
                <div className="absolute -bottom-4 -right-4 bg-pink text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  🇺🇸 Veteran — 100% T&amp;P
                </div>
              </div>
            </motion.div>

            {/* Text column */}
            <motion.div variants={fadeIn} className="lg:col-span-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight">
                The Discipline of Service.<br />The Integrity You Deserve.
              </h2>
              <div className="text-white/85 leading-relaxed space-y-4 text-sm sm:text-base">
                <p>
                  Before Matthew Urbanski became a Certified Field Inspector with AquaGuard Foundation Solutions, he served 6+ years in the United States Air Force — including a specialty in Explosive Ordnance Disposal and managing a $4.2 billion national security infrastructure network for the NSA.
                </p>
                <p>
                  He led teams of up to 41 people, built training programs that cut qualification time from 12 months to 4, and processed thousands of critical trouble tickets — all under pressure, all with zero margin for error.
                </p>
                <p>
                  That same standard is what he brings to every home inspection. No shortcuts. No overselling. Just honest answers and a plan that works for your home and your budget.
                </p>
                <p className="text-pink font-semibold text-base sm:text-lg italic">
                  Matthew served this country with a 100% service-connected disability rating — Total and Permanent. He didn&apos;t stop serving. He just changed his mission.
                </p>
              </div>

              {/* Credentials */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-xl">🇺🇸</span>
                  <span className="text-sm font-medium">U.S. Air Force Veteran | Honorably Discharged</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-xl">🏅</span>
                  <span className="text-sm font-medium">100% VA Disability — Total &amp; Permanent (T&amp;P)</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-xl">🎖️</span>
                  <span className="text-sm font-medium">Cyber Transport Systems | EOD</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-xl">🏆</span>
                  <span className="text-sm font-medium">AF Outstanding Unit · Good Conduct · GWOT Service Medal</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 7 — VIDEO ===== */}
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
              Watch the Full AquaGuard Video Gallery &rarr;
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 8 — PHOTO GALLERY ===== */}
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
            {GALLERY_IMAGES.map((photo) => (
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

      {/* ===== SECTION 9 — GOOGLE REVIEWS ===== */}
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
              {[...Array(4)].map((_, i) => (
                <span key={i}>&#9733;</span>
              ))}
              <span className="text-yellow-400/70">&#9733;</span>
            </div>
            <p className="text-white/70 text-lg">4.8 ⭐ across 1,500+ reviews</p>
          </motion.div>

          {/* Reviews grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {REVIEWS.map((review) => (
              <motion.div
                key={review.author}
                variants={fadeIn}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 flex flex-col"
              >
                <div className="flex gap-1 text-pink text-lg mb-4">
                  {[...Array(review.stars)].map((_, i) => (
                    <span key={i}>&#9733;</span>
                  ))}
                </div>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed flex-1 mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <span className="text-white/60 font-semibold text-sm">— {review.author}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Review buttons */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="https://www.aquaguard.net/about/reviews/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-pink hover:bg-pink-dark text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg"
            >
              Read More Reviews
            </a>
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-full transition-colors border border-white/30"
            >
              Leave a Review
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 10 — CONNECT WITH US ===== */}
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
                {SOCIAL_LINKS.aquaguard.map((link) => (
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
                {SOCIAL_LINKS.groundworks.map((link) => (
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

      {/* ===== SECTION 11 — FOOTER ===== */}
      <footer className="bg-navy-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
            {/* Contact */}
            <div>
              <p className="font-bold text-lg mb-1">Matthew Urbanski</p>
              <p className="text-white/70 text-sm mb-1">Certified Field Inspector — AquaGuard</p>
              <p className="text-white/50 text-xs mb-3">A Groundworks Company</p>
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

            {/* Center — social icons + badges */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex justify-center gap-5">
                {[
                  { icon: "📘", url: "https://www.facebook.com/AquaGuardFoundationSolutions/", label: "Facebook" },
                  { icon: "📸", url: "https://www.instagram.com/aquaguardfoundationsolutions/", label: "Instagram" },
                  { icon: "💼", url: "https://www.linkedin.com/company/aquaguard-basement-systems", label: "LinkedIn" },
                  { icon: "🌐", url: "https://www.aquaguard.net", label: "Website" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-pink transition-colors text-2xl"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
              <p className="text-white/60 text-sm">Proudly Serving Atlanta &amp; North Georgia</p>
              <p className="text-white/50 text-xs">🇺🇸 U.S. Air Force Veteran — 100% T&amp;P</p>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-white/50 text-sm">
                &copy; 2025 Matthew Urbanski — AquaGuard Foundation Solutions.
              </p>
              <p className="text-white/40 text-xs mt-1">All rights reserved.</p>
              <a href="#" className="text-white/30 text-xs hover:text-white/60 transition-colors mt-2 inline-block">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
