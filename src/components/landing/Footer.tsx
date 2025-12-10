import React from 'react';
import { 
  Linkedin, 
  Github, 
  Mail,
  ExternalLink 
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 px-4 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
              Tata Capital <span className="text-gradient-primary">AI</span>
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Experience the future of personal loans with our AI-powered chatbot. 
              Quick approvals, smart savings, and a human-like conversation.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Personal Loan</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">EMI Calculator</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Eligibility Check</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Investment Options</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Tata Capital</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 EY Techathon 6.0 Submission. Built for demonstration purposes.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built by</span>
            <a 
              href="#" 
              className="text-primary font-medium hover:underline flex items-center gap-1"
            >
              Astha More
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}