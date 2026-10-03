import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Is Swami Bharmanand Gurukul affiliated to CBSE?',
    a: 'Yes, we are fully affiliated with the Central Board of Secondary Education (CBSE), New Delhi, up to Senior Secondary level (+2).'
  },
  {
    q: 'What is the medium of instruction?',
    a: 'The primary medium of instruction is English. However, we place a strong emphasis on Hindi and Sanskrit to maintain our cultural roots.'
  },
  {
    q: 'Are hostel facilities available for both boys and girls?',
    a: 'Currently, our residential hostel facility is available exclusively for boys from Class 4 onwards. Day boarding is available for all.'
  },
  {
    q: 'What is the student-teacher ratio?',
    a: 'We maintain a healthy student-teacher ratio of 25:1 to ensure personalized attention and better academic tracking.'
  },
  {
    q: 'Do you provide transport facilities?',
    a: 'Yes, we have a fleet of GPS-enabled school buses that cover Pundri, Kaithal, and surrounding villages within a 30km radius.'
  },
  {
    q: 'How do you incorporate Gurukul values in daily routine?',
    a: 'Our day starts with Vedic chanting and Yoga. We have regular moral education classes, traditional festivals celebrations, and a strong emphasis on discipline and respect for elders.'
  }
];

export function FAQ() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Got Questions?</span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full bg-card rounded-2xl p-6 shadow-sm border border-border/50">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left font-semibold text-lg text-foreground hover:text-primary transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
