import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Get in Touch</span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground mb-6">
            Contact Us
          </h2>
          <p className="text-muted-foreground text-lg">
            Visit our campus or drop us a message. We are always happy to answer your queries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Details & Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Call Us</h3>
                <p className="text-muted-foreground text-sm">+91 92551 45421</p>
                <p className="text-muted-foreground text-sm">+91 99961 22410</p>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Email Us</h3>
                <p className="text-muted-foreground text-sm">gurukulbanipundri@gmail.com</p>
                <p className="text-muted-foreground text-sm">www.sbgpundri.com</p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Campus Address</h3>
                <p className="text-muted-foreground">
                  Swami Bharmanand Gurukul,<br />
                  Jind Road, Pundri,<br />
                  District Kaithal, Haryana, India
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border h-[300px] shadow-sm">
              <iframe
                title="School Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3460.016335198278!2d76.5492!3d29.7563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390df0c1024bd35b%3A0x6b77c5b65f375f!2sPundri%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-3xl p-8 shadow-xl border border-border/60"
          >
            <h3 className="text-2xl font-bold font-serif text-foreground mb-6">Send a Message</h3>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
                <select 
                  id="subject"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none"
                >
                  <option value="admission">Admission Enquiry</option>
                  <option value="general">General Query</option>
                  <option value="career">Careers</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">Your Message</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90 py-6 text-lg rounded-xl shadow-md">
                Send Message
                <Send className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
