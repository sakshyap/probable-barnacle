import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

type Message = {
  id: number;
  from: 'bot' | 'user';
  text: string;
};

const QUICK_REPLIES = [
  'Admission Process',
  'Fees Structure',
  'School Timings',
  'Contact Details',
  'Facilities',
];

const ANSWERS: Record<string, string> = {
  'Admission Process':
    'Admission ke liye yeh process follow hota hai:\n1. Apply — registration form online ya school reception par fill karein.\n2. Document verification — previous academic records, birth certificate aur ID proofs submit karein.\n3. Entrance test — Class 1 aur above ke liye basic assessment.\n4. Interview — Principal se interaction.\n5. Confirmation — fee payment aur seat confirmation.\n\nRequired documents: Birth Certificate, Transfer Certificate (original), last report card/marksheet, Aadhar copies (student & parents), 4 passport-size photos.',
  'Fees Structure':
    'Detailed fee structure school office mein available hai (nai /admissions page ke Fee Structure section par bhi refer kar sakte hain).\n\nCurrent admission cycle ke exact fee details ke liye school office ko call karein:\n• +91 92551 45421 / +91 99961 22410\n• ya email karein: gurukulbanipundri@gmail.com',
  'School Timings':
    'School ke class groups ke timings:\n• Pre-Primary (Nursery–UKG): 8:00 AM – 12:30 PM\n• Primary (Classes I–V): 8:00 AM – 2:30 PM\n• Middle (Classes VI–VIII): 8:00 AM – 3:00 PM\n• Secondary (Classes IX–X): 8:00 AM – 3:30 PM\n• Senior Secondary (XI–XII): 8:00 AM – 3:30 PM',
  'Contact Details':
    'Contact details:\n• Call: +91 92551 45421 / +91 99961 22410\n• Email: gurukulbanipundri@gmail.com\n• Address: Swami Bharmanand Gurukul, Jind Road, Pundri, District Kaithal, Haryana, India\n\nWebsite ke /contact page par message form bhi hai — wahan directly enquiry bhej sakte hain.',
  Facilities:
    'School facilities:\n• Smart Classrooms (interactive panels)\n• Science Labs (Physics, Chemistry, Biology)\n• Computer Lab (high-speed internet)\n• Rich Library (academic + spiritual texts)\n• Gurukul Hostel (boys, Class 4 onwards)\n• Sports Complex (expansive grounds)\n• Transport fleet (30 km radius cover)\n• Medical infirmary (trained staff on campus)',
};

const FALLBACK_ANSWER =
  'Sorry, main abhi sirf is website ke common questions ka jawab de sakta hoon. Iske liye humein Contact form (/contact) se message karein ya call karein: +91 92551 45421.';

const WELCOME_MESSAGE =
  'Namaste! Hamari school website mein aapka swagat hai. Aap kya jaanna chahenge?';

let messageId = 0;

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: ++messageId, from: 'bot', text: WELCOME_MESSAGE }]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, open]);

  const replyTo = (question: string) => {
    setMessages((prev) => [...prev, { id: ++messageId, from: 'user', text: question }]);
    setIsTyping(true);

    const answer = ANSWERS[question] ?? FALLBACK_ANSWER;
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: ++messageId, from: 'bot', text: answer }]);
      setIsTyping(false);
    }, 600);
  };

  const handleQuickReply = (reply: string) => {
    replyTo(reply);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    replyTo(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Gurukul school chatbot"
            className="flex h-[min(70vh,520px)] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-secondary-border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-secondary px-5 py-4 text-secondary-foreground">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold font-serif">Swami Bharmanand Gurukul</p>
                  <p className="hindi-text text-xs text-secondary-foreground/80">
                    स्वामी ब्रह्मानंद गुरुकुल
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chatbot"
                className="rounded-full p-1.5 transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-background px-4 py-4">
              {messages.map((msg) =>
                msg.from === 'bot' ? (
                  <div
                    key={msg.id}
                    className="max-w-[85%] self-start whitespace-pre-line rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-2.5 text-sm leading-relaxed text-foreground"
                  >
                    {msg.text}
                  </div>
                ) : (
                  <div
                    key={msg.id}
                    className="ml-auto max-w-[85%] self-end whitespace-pre-line rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground"
                  >
                    {msg.text}
                  </div>
                ),
              )}
              {isTyping && (
                <div
                  className="flex items-center gap-1 self-start rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-2.5"
                  aria-label="Bot is typing"
                >
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div className="flex flex-wrap gap-2 border-t border-border bg-background px-3 py-2">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleQuickReply(reply)}
                  className="rounded-full border border-accent-border bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-primary hover:text-white"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-border bg-background p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Apna sawal likhein..."
                aria-label="Type your question"
                className="min-w-0 flex-1 rounded-full border border-input bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          aria-label="Open chatbot"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-primary-border bg-primary text-white shadow-lg transition-transform hover:scale-110"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageCircle className="h-7 w-7" />
        </motion.button>
      )}
    </div>
  );
}