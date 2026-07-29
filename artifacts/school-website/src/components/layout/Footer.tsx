import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export function Footer() {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 border-t-4 border-primary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white mb-1">Swami Bharmanand Gurukul</h3>
              <p className="text-primary font-medium hindi-text">स्वामी ब्रह्मानंद गुरुकुल</p>
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed text-sm">
              An ancient Indian Gurukul revived in the modern era. Quality education rooted in Indian culture, holistic development, and character building since 25 years.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6 font-serif relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', href: '#about' },
                { name: 'Admissions', href: '#admissions' },
                { name: 'Academic Programs', href: '#programs' },
                { name: 'Our Facilities', href: '#facilities' },
                { name: 'Photo Gallery', href: '#gallery' },
                { name: 'Contact Us', href: '#contact' },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    className="text-secondary-foreground/80 hover:text-primary transition-colors flex items-center group"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6 font-serif relative inline-block">
              Important Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'CBSE Mandatory Disclosure', href: '#' },
                { name: 'Transfer Certificates', href: '#' },
                { name: 'Fee Structure', href: '#admissions' },
                { name: 'School Calendar', href: '#' },
                { name: 'Careers / Jobs', href: '#' },
                { name: 'Alumni Network', href: '#' },
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-secondary-foreground/80 hover:text-primary transition-colors flex items-center group">
                    <span className="h-1 w-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6 font-serif relative inline-block">
              Contact Info
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-primary shrink-0" />
                <span className="text-secondary-foreground/80 text-sm leading-relaxed">
                  Swami Bharmanand Gurukul,<br />
                  Jind Road, Pundri,<br />
                  Kaithal, Haryana, India
                </span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-3 text-primary shrink-0" />
                <span className="text-secondary-foreground/80">+91 92551 45421 / +91 99961 22410</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-primary shrink-0" />
                <span className="text-secondary-foreground/80">gurukulbanipundri@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-secondary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Swami Bharmanand Gurukul. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
