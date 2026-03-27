// Hardcoded contact defaults (editable in admin settings)
export const DEFAULT_CONTACT = {
  name: "Matthew Urbanski",
  phone: "(470) 568-1681",
  email: "matthew.urbanski@AquaGuard.net",
  website: "mattataquaguard.com",
};

export const TRUST_BADGES = [
  "BBB A+ Rated Since 1998",
  "Free Inspection — No Obligation",
  "25+ Years Serving Georgia",
  "Nationally Backed Transferable Warranties",
  "Certified Field Inspector (CFI)",
];

export const ISSUE_TYPES = [
  {
    id: "basement_water",
    label: "Basement Water / Flooding",
    icon: "🌊",
  },
  {
    id: "foundation",
    label: "Foundation Cracks or Wall Problems",
    icon: "🧱",
  },
  {
    id: "crawl_space",
    label: "Crawl Space Issues",
    description: "moisture, odor, sagging floors",
    icon: "🕳️",
  },
  {
    id: "concrete",
    label: "Sinking or Uneven Concrete",
    description: "driveway, patio, sidewalk, garage",
    icon: "🏗️",
  },
  {
    id: "structural",
    label: "Structural / Floor Support Issues",
    icon: "🔧",
  },
  {
    id: "general",
    label: "Not Sure — General Inspection",
    icon: "❓",
  },
];

export const SERVICES = [
  {
    title: "Foundation Repair",
    description:
      "Pier systems, wall anchors, IntelliBrace™ wall repair",
    image: "/images/foundation-repair.jpg",
    icon: "🧱",
  },
  {
    title: "Basement Waterproofing",
    description:
      "BasementGutter™, sump pumps, vapor barriers, dehumidifiers",
    image: "/images/basement-before-after.jpg",
    icon: "🌊",
  },
  {
    title: "Crawl Space Encapsulation",
    description:
      "Moisture control, IntelliJack™ supports, encapsulation",
    image: "/images/crawl-space-before-after.jpg",
    icon: "🕳️",
  },
  {
    title: "Concrete Lifting",
    description:
      "PolyRenewal™ foam lifting for driveways, patios, walkways, garage floors",
    image: "/images/concrete-lifting.jpg",
    icon: "🏗️",
  },
];

export const REVIEWS = [
  {
    text: "Matt was very friendly and knowledgeable. He included me in every step of the inspection process and was very thorough in explaining the process and his results. I was relieved to discover there were no issues with my foundation, but he did discover an issue with my back porch slab that other companies I'd used didn't find. We came up with an affordable solution for that issue. Thank you Matt!!",
    author: "Verified Google Review",
    stars: 5,
  },
  {
    text: "Matthew Urbanski developed a comprehensive, phased plan to level the floors of my 100+ year-old home — fully tailored to my house, budget, and timeline. He drafted intricate drawings of my crawlspace in what felt like minutes — drawings I'll keep for years to come. Matthew was thorough, diligent, and genuinely listened to my needs. I'm happy to be working with him and I'm glad he has my account. AquaGuard is lucky to have Mr. Urbanski!",
    author: "Verified Google Review",
    stars: 5,
  },
  {
    text: "Aquaguard, specifically Matt (sales), PJ, and Alan from the installation team have been A+ FANTASTIC. These guys have gone above and beyond my expectations. From the initial inspection/evaluation and quote process, to the actual install. They have lifted my home…and lifted my spirits. It is good to know that there are good honest companies who employ trustworthy honest guys. Again these 3 have exceeded my expectations. From being consultative, to being friendly, to keeping me informed every step of the way. They showed they didn't just care about the job, they cared about my home, and more importantly they showed they cared about me and my family. I can't say enough about these 3. If the rest of the company is like these 3, it is a top notch company. Thank you for all of your help.",
    author: "Gary Rhone | Verified Google Review",
    stars: 5,
  },
];

export const SOCIAL_LINKS = {
  aquaguard: [
    {
      label: "AquaGuard Website",
      url: "https://www.aquaguard.net",
      icon: "globe",
    },
    {
      label: "Facebook",
      url: "https://www.facebook.com/AquaGuardFoundationSolutions/",
      icon: "facebook",
    },
    {
      label: "Instagram",
      url: "https://www.instagram.com/aquaguardfoundationsolutions/",
      icon: "instagram",
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/aquaguard-basement-systems",
      icon: "linkedin",
    },
    {
      label: "Video Gallery",
      url: "https://www.aquaguard.net/video-gallery/",
      icon: "youtube",
    },
    {
      label: "Mike Rowe Series",
      url: "https://www.aquaguard.net/rowe/",
      icon: "tv",
    },
  ],
  groundworks: [
    {
      label: "Groundworks",
      url: "https://www.groundworks.com",
      icon: "globe",
    },
    {
      label: "AquaGuard Location",
      url: "https://www.groundworks.com/locations/aquaguard-foundation-solutions/",
      icon: "mapPin",
    },
  ],
};

export const GALLERY_IMAGES = [
  {
    src: "/images/basement-before-after.jpg",
    alt: "Basement waterproofing before and after",
  },
  {
    src: "/images/foundation-repair.jpg",
    alt: "Foundation pier system installation",
  },
  {
    src: "/images/crawl-space-before-after.jpg",
    alt: "Crawl space encapsulation before and after",
  },
  {
    src: "/images/concrete-lifting.jpg",
    alt: "Concrete lifting before and after",
  },
  {
    src: "/images/sloping-floors.jpg",
    alt: "Sloping floors repair before and after",
  },
  {
    src: "/images/sump-pump-install.jpg",
    alt: "Sump pump installation",
  },
  {
    src: "/images/services-collage.jpg",
    alt: "AquaGuard services overview",
  },
];

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Appointment Set",
  "Inspected",
  "Proposal Sent",
  "Sold",
  "Lost",
];
