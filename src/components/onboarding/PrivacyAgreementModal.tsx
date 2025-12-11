import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrivacyAgreementModalProps {
  open: boolean;
  onAgree: () => void;
}

export function PrivacyAgreementModal({ open, onAgree }: PrivacyAgreementModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] p-0 overflow-hidden bg-card border-border"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="bg-gradient-primary p-6 text-primary-foreground">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield size={28} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-display font-bold text-white">
                Privacy Agreement
              </DialogTitle>
              <DialogDescription className="text-white/80">
                Please review and accept our terms to continue
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Key Points */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-secondary/50">
              <Lock size={24} className="text-primary mb-2" />
              <span className="text-xs text-muted-foreground">Bank-Grade Security</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-secondary/50">
              <Eye size={24} className="text-primary mb-2" />
              <span className="text-xs text-muted-foreground">Data Transparency</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-secondary/50">
              <FileText size={24} className="text-primary mb-2" />
              <span className="text-xs text-muted-foreground">RBI Compliant</span>
            </div>
          </div>

          {/* Terms Content */}
          <ScrollArea className="h-[300px] rounded-lg border border-border p-4 mb-6">
            <div className="space-y-4 text-sm text-muted-foreground">
              <section>
                <h3 className="font-display font-semibold text-foreground mb-2">1. Data Collection & Usage</h3>
                <p>
                  Tata Capital collects personal information including your name, contact details, 
                  financial information, and identity documents to process your loan application. 
                  This data is used solely for:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Verifying your identity and KYC compliance</li>
                  <li>Assessing your creditworthiness</li>
                  <li>Processing and disbursing your loan</li>
                  <li>Communicating updates about your application</li>
                </ul>
              </section>

              <section>
                <h3 className="font-display font-semibold text-foreground mb-2">2. Credit Bureau Access</h3>
                <p>
                  By agreeing to these terms, you authorize Tata Capital to access your credit 
                  report from credit bureaus (CIBIL, Experian, Equifax, CRIF High Mark) for 
                  the purpose of evaluating your loan application. This is a soft inquiry that 
                  will not affect your credit score.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold text-foreground mb-2">3. Document Verification</h3>
                <p>
                  Your uploaded documents (PAN card, Aadhaar, income proof) will be verified 
                  using AI-powered analysis and government databases. All documents are 
                  encrypted and stored securely in compliance with data protection regulations.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold text-foreground mb-2">4. Investment Recommendations</h3>
                <p>
                  Our Investment Agent may provide personalized savings and investment 
                  recommendations based on your financial profile. These are suggestions 
                  only and not financial advice. You are free to accept or decline any 
                  investment options offered.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold text-foreground mb-2">5. Data Security</h3>
                <p>
                  We employ industry-standard encryption (AES-256) and security measures to 
                  protect your data. Our systems are regularly audited and comply with:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Reserve Bank of India (RBI) guidelines</li>
                  <li>Information Technology Act, 2000</li>
                  <li>Data Protection Bill provisions</li>
                </ul>
              </section>

              <section>
                <h3 className="font-display font-semibold text-foreground mb-2">6. Your Rights</h3>
                <p>You have the right to:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Access your personal data we hold</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data (subject to legal requirements)</li>
                  <li>Withdraw consent for marketing communications</li>
                </ul>
              </section>

              <section>
                <h3 className="font-display font-semibold text-foreground mb-2">7. Contact Information</h3>
                <p>
                  For any privacy-related queries or concerns, contact our Data Protection Officer at:
                  <br />
                  Email: privacy@tatacapital.com
                  <br />
                  Phone: 1800-267-8282
                </p>
              </section>
            </div>
          </ScrollArea>

          {/* Agreement Button */}
          <Button 
            onClick={onAgree}
            size="lg"
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
          >
            <CheckCircle2 className="mr-2" size={20} />
            I Agree to the Terms & Privacy Policy
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            By clicking "I Agree", you confirm that you have read and understood our 
            Privacy Policy and Terms of Service.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
