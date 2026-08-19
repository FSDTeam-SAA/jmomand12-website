import React from 'react';
import { UserCheck, CreditCard, MessageSquare, Activity, Monitor, Settings, ShieldCheck, Share2, Cookie, CheckCircle2, FileText, Mail } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Discount Deals',
  description: 'Privacy Policy explaining how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header Section */}
        <section className="mb-8 overflow-hidden rounded-2xl bg-[#08255a] p-8 text-white md:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Legal Information</p>
            <h1 className="mt-3 text-3xl font-bold md:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-sm leading-7 text-[#aebcdc] md:text-base">
              At discountdealsdmv, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect, how we use it, how we protect it, and the choices you have regarding your personal data.
            </p>
            <p className="mt-2 text-sm leading-7 text-[#aebcdc] md:text-base italic">
              By creating an account or using our auction platform, you agree to the collection and use of your information as described in this Privacy Policy.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="rounded-2xl border border-[#dce6f5] bg-white p-6 shadow-sm md:p-10">
          <div className="prose prose-slate max-w-none prose-headings:text-[#08255a] prose-a:text-orange-500 hover:prose-a:text-orange-600">
            
            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3 border-b border-[#dce6f5] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h2 className="!mb-0 !mt-0 text-2xl font-bold text-[#111827]">Information We Collect</h2>
              </div>
              <p className="text-[#374151]">We may collect the following types of information:</p>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3 flex items-center gap-2">
                Account Information
              </h3>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Billing and shipping addresses</li>
                <li>Username and account credentials</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3 flex items-center gap-2">
                Payment Information
              </h3>
              <p className="text-[#374151]">Payments are securely processed through Stripe. We do not store your complete credit or debit card information on our servers. Payment information is handled in accordance with Stripe&apos;s security and privacy standards.</p>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3 flex items-center gap-2">
                SMS/MMS and Email Terms & Conditions
              </h3>
              <p className="text-[#374151]">By providing your contact information, you agree to receive marketing and reminder messages from Discount Deals via SMS/MMS and email. Message frequency may vary, and message and data rates may apply.</p>
              <p className="text-[#374151]">If you have any questions or concerns, please contact us at <a href="mailto:info@discountdealsdmv.com">info@discountdealsdmv.com</a>.</p>
              <p className="text-[#374151]">You may opt out of receiving marketing messages at any time by emailing <a href="mailto:info@discountdealsdmv.com">info@discountdealsdmv.com</a> with your request to unsubscribe.</p>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3 flex items-center gap-2">
                Auction Activity
              </h3>
              <p className="text-[#374151]">We collect information related to your use of our auction platform, including:</p>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>Bidding history</li>
                <li>Winning and unsuccessful bids</li>
                <li>Purchase history</li>
                <li>Payment status</li>
                <li>Pickup and shipping preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3 flex items-center gap-2">
                Technical Information
              </h3>
              <p className="text-[#374151]">To help protect your account and improve our services, we may automatically collect:</p>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>IP address</li>
                <li>Device type</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Log files</li>
                <li>Cookies and similar technologies</li>
                <li>Website usage and activity</li>
              </ul>
            </div>

            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3 border-b border-[#dce6f5] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <Settings className="h-5 w-5" />
                </div>
                <h2 className="!mb-0 !mt-0 text-2xl font-bold text-[#111827]">How We Use Your Information</h2>
              </div>
              <p className="text-[#374151]">Your information is used to:</p>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>Create and manage your account.</li>
                <li>Process auction bids, purchases, payments, and refunds.</li>
                <li>Verify your identity and help prevent fraud.</li>
                <li>Send auction updates, bid notifications, invoices, payment confirmations, shipping updates, and pickup reminders.</li>
                <li>Respond to customer service requests.</li>
                <li>Improve our website, services, and user experience.</li>
                <li>Maintain the security and integrity of our platform.</li>
                <li>Comply with applicable legal and regulatory requirements.</li>
              </ul>
            </div>

            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3 border-b border-[#dce6f5] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="!mb-0 !mt-0 text-2xl font-bold text-[#111827]">Data Protection</h2>
              </div>
              <p className="text-[#374151]">We take reasonable administrative, technical, and physical measures to safeguard your personal information.</p>
              <p className="text-[#374151]">Our security practices include:</p>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>Secure SSL/TLS encryption for data transmitted between your device and our website.</li>
                <li>Payment processing through Stripe using industry-standard security practices.</li>
                <li>Restricted access to personal information by authorized personnel only.</li>
                <li>Ongoing monitoring to help protect against unauthorized access, misuse, or disclosure.</li>
              </ul>
              <div className="mt-6 rounded-xl bg-[#eef4ff] p-4 text-sm text-[#0b3f9c] border border-[#dce6f5]">
                <strong>Note:</strong> While we use commercially reasonable security measures, no online system can guarantee absolute security.
              </div>
            </div>

            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3 border-b border-[#dce6f5] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <Share2 className="h-5 w-5" />
                </div>
                <h2 className="!mb-0 !mt-0 text-2xl font-bold text-[#111827]">Sharing of Information</h2>
              </div>
              <p className="text-[#374151] font-semibold text-orange-500">We do not sell, rent, or trade your personal information to third parties for advertising or marketing purposes.</p>
              <p className="text-[#374151] mt-4">We may share information only when necessary to:</p>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>Process payments through our payment provider.</li>
                <li>Ship purchased items through shipping carriers.</li>
                <li>Comply with applicable laws, court orders, or legal requests.</li>
                <li>Protect the rights, property, safety, or security of Discount Deals, our customers, or others.</li>
              </ul>
            </div>

            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3 border-b border-[#dce6f5] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <Cookie className="h-5 w-5" />
                </div>
                <h2 className="!mb-0 !mt-0 text-2xl font-bold text-[#111827]">Cookies and Similar Technologies</h2>
              </div>
              <p className="text-[#374151]">Our website may use cookies and similar technologies to:</p>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>Keep you signed in.</li>
                <li>Remember your preferences.</li>
                <li>Improve website functionality.</li>
                <li>Analyze website performance and usage.</li>
                <li>Enhance your browsing experience.</li>
              </ul>
              <p className="text-[#374151] mt-4">You may manage or disable cookies through your browser settings, although doing so may affect certain website features.</p>
            </div>

            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3 border-b border-[#dce6f5] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h2 className="!mb-0 !mt-0 text-2xl font-bold text-[#111827]">Your Privacy Rights</h2>
              </div>
              <p className="text-[#374151]">You may request to:</p>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>Access the personal information we maintain about you.</li>
                <li>Correct inaccurate or incomplete information.</li>
                <li>Update your account details.</li>
                <li>Delete your account and personal information, subject to legal and business record retention requirements.</li>
                <li>Opt out of certain non-essential communications.</li>
              </ul>
              <p className="text-[#374151] mt-4">To submit a privacy-related request, please contact us using the information below.</p>
            </div>

            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3 border-b border-[#dce6f5] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="!mb-0 !mt-0 text-2xl font-bold text-[#111827]">Changes to This Privacy Policy</h2>
              </div>
              <p className="text-[#374151]">
                We may update this Privacy Policy from time to time to reflect changes in our business practices, legal requirements, or services. Any updates will become effective when posted on this website. Continued use of our platform after changes are posted constitutes acceptance of the revised Privacy Policy.
              </p>
            </div>

            <div className="mb-0">
              <div className="mb-4 flex items-center gap-3 border-b border-[#dce6f5] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="!mb-0 !mt-0 text-2xl font-bold text-[#111827]">Contact Us</h2>
              </div>
              <p className="text-[#374151]">If you have any questions about this Privacy Policy or would like to exercise your privacy rights, please contact us:</p>
              <div className="mt-4 p-5 bg-[#f7f9fc] rounded-xl border border-[#dce6f5] text-[#374151] flex flex-col gap-2">
                <p><strong>Email:</strong> <a href="mailto:info@discountdealsdmv.com">info@discountdealsdmv.com</a></p>
                <p><strong>Address:</strong><br />8430 Quarry road, Manassas VA 20110</p>
                <p><strong>Website:</strong> <a href="https://discountdealsdmv.com" target="_blank" rel="noopener noreferrer">discountdealsdmv.com</a></p>
              </div>
            </div>
            
          </div>
        </section>
      </div>
    </main>
  );
}
