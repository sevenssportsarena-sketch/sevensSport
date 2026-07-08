import prisma from "./src/lib/prisma";

const pagesData = [
  {
    slug: "about",
    title: "About Us",
    content: `
      <p>Welcome to <strong>SevensSportsArena</strong>, your premier destination for all things sports.</p>
      <p>We are dedicated to bringing you the latest news, in-depth analysis, and comprehensive coverage of European Football, Nigerian Football, NBA, Athletics, and more.</p>
      <h2>Our Mission</h2>
      <p>To provide fast, accurate, and engaging sports content that connects fans globally. We believe in the power of sports to unite people and inspire greatness.</p>
      <h2>Our Team</h2>
      <p>Our editorial team consists of passionate sports enthusiasts and seasoned journalists who work around the clock to deliver high-quality content directly to your screen.</p>
    `
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    content: `
      <p>Your privacy is important to us. It is SevensSportsArena's policy to respect your privacy regarding any information we may collect from you across our website.</p>
      <h2>Information We Collect</h2>
      <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
      <h2>Log Data</h2>
      <p>When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your computer's Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details.</p>
    `
  },
  {
    slug: "terms",
    title: "Terms of Service",
    content: `
      <p>These terms of service govern your use of the SevensSportsArena website. By accessing this website, you agree to these terms and conditions.</p>
      <h2>Use License</h2>
      <p>Permission is granted to temporarily download one copy of the materials (information or software) on SevensSportsArena's website for personal, non-commercial transitory viewing only.</p>
      <h2>Disclaimer</h2>
      <p>The materials on SevensSportsArena's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.</p>
    `
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    content: `
      <p>This Cookie Policy explains how SevensSportsArena uses cookies and similar technologies to recognize you when you visit our website.</p>
      <h2>What are cookies?</h2>
      <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
      <h2>How we use cookies</h2>
      <p>We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. We also share information about your use of our site with our social media, advertising and analytics partners.</p>
    `
  },
  {
    slug: "advertise",
    title: "Advertise with Us",
    content: `
      <p>Reach a global audience of passionate sports fans by advertising on SevensSportsArena.</p>
      <h2>Why Advertise With Us?</h2>
      <p>Our platform offers highly targeted advertising opportunities across various sports categories. Whether you're looking for banner placements, sponsored articles, or newsletter sponsorships, we have customizable packages to suit your brand's needs.</p>
      <h2>Get in Touch</h2>
      <p>Contact our advertising team today to request our media kit and discuss how we can help you achieve your marketing goals.</p>
    `
  },
  {
    slug: "contact",
    title: "Contact Us",
    content: `
      <p>Have a question, feedback, or a news tip? We'd love to hear from you!</p>
      <h2>Get In Touch</h2>
      <p>Email: contact@sevenssportsarena.com</p>
      <p>Phone: +1 (555) 123-4567</p>
      <h2>Office Location</h2>
      <p>123 Sports Avenue, Suite 100<br/>New York, NY 10001</p>
    `
  }
];

async function main() {
  for (const page of pagesData) {
    await prisma.sitePage.upsert({
      where: { slug: page.slug },
      update: {},
      create: {
        slug: page.slug,
        title: page.title,
        content: page.content.trim()
      }
    });
    console.log("Seeded page:", page.slug);
  }
}

main()
  .catch(console.error);
