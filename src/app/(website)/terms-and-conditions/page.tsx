import React from 'react';
import { ShieldCheck, CreditCard, Truck, RefreshCcw } from 'lucide-react';

export const metadata = {
  title: 'Terms and Conditions | Discount Deals',
  description: 'Terms and conditions for buying, shipping, payments, and returns.',
};

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header Section */}
        <section className="mb-8 overflow-hidden rounded-2xl bg-[#08255a] p-8 text-white md:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Legal Information</p>
            <h1 className="mt-3 text-3xl font-bold md:text-5xl">Terms & Conditions</h1>
            <p className="mt-4 text-sm leading-7 text-[#aebcdc] md:text-base">
              Please review our policies regarding payments, shipping, returns, and buyer premiums to ensure a smooth auction experience.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="rounded-2xl border border-[#dce6f5] bg-white p-6 shadow-sm md:p-10">
          <div className="prose prose-slate max-w-none prose-headings:text-[#08255a] prose-a:text-orange-500 hover:prose-a:text-orange-600">
            
            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3 border-b border-[#dce6f5] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="!mb-0 !mt-0 text-2xl font-bold text-[#111827]">Buyer Premium & Fees</h2>
              </div>
              <p className="text-[#374151]">
                <strong>15% buyer&apos;s premium</strong> applies to all purchases and will be added to your final winning bid at checkout with <strong>5.5% VA sales</strong> and <strong>3.3% credit card processing fee</strong>.
              </p>
            </div>

            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3 border-b border-[#dce6f5] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="!mb-0 !mt-0 text-2xl font-bold text-[#111827]">Payment Policy</h2>
              </div>
              <p className="text-[#374151]">Payment for all winning auction items is due within <strong>24 hours</strong> of the auction closing.</p>
              <p className="text-[#374151]">
                To participate in our auctions, you must maintain a valid credit or debit card on file. By placing a bid, you authorize us to automatically charge your saved payment method if you are the winning bidder.
              </p>
              <p className="text-[#374151]">
                If your payment cannot be processed, you will be notified and given the opportunity to update your payment information. Payment must still be successfully completed within the original 24-hour payment deadline.
              </p>
              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3">Failure to pay within 24 hours may result in:</h3>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>Cancellation and forfeiture of the winning item.</li>
                <li>Suspension or restriction of your bidding privileges.</li>
                <li>Additional account actions at our discretion for repeated non-payment.</li>
              </ul>
              <div className="mt-6 rounded-xl bg-[#eef4ff] p-4 text-sm text-[#0b3f9c] border border-[#dce6f5]">
                <strong>Note:</strong> All prices are displayed in U.S. Dollars (USD). Applicable sales taxes, buyer&apos;s premiums (if applicable), credit card processing fees, shipping charges, and any other applicable fees will be calculated and added during checkout before your final payment is processed.
              </div>
            </div>

            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3 border-b border-[#dce6f5] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <Truck className="h-5 w-5" />
                </div>
                <h2 className="!mb-0 !mt-0 text-2xl font-bold text-[#111827]">Shipping Policy</h2>
              </div>
              <p className="text-[#374151]">
                We are committed to processing and shipping your purchases promptly and securely. However, in the event of severe weather, natural disasters, transportation disruptions, or other unforeseen circumstances beyond our control, delivery may be delayed and rescheduled for the next available date.
              </p>
              
              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3">Shipping Eligibility</h3>
              <p className="text-[#374151]">Items will be shipped only after all of the following requirements have been met:</p>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>Full payment for all invoices has been received and successfully processed.</li>
                <li>A complete and valid shipping address has been provided.</li>
                <li>Any additional shipping charges, if applicable, have been paid.</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3">Order Processing</h3>
              <p className="text-[#374151]">Once payment has been confirmed, orders are typically processed and shipped within <strong>5–7 business days</strong>.</p>
              <p className="text-[#374151]">Before shipment, every item is carefully inspected and securely packaged to help ensure it arrives in the same condition in which it was sold.</p>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3">Shipment Tracking</h3>
              <p className="text-[#374151]">After your order has been shipped, you will receive an email confirmation containing your tracking number. Delivery times vary depending on the shipping carrier, shipping method selected, destination, and other factors outside our control.</p>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3">Shipping Restrictions</h3>
              <p className="text-[#374151]">Items cannot be shipped if:</p>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>Payment for any outstanding invoice has not been completed.</li>
                <li>A valid shipping address has not been provided.</li>
                <li>Required shipping fees or other applicable charges remain unpaid.</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3">Shipping Origin</h3>
              <p className="text-[#374151]">Items are shipped from our warehouse in Manassas, Virginia, or from one of our other warehouse locations. Shipping costs may vary depending on the shipment&apos;s origin, destination, size, weight, and distance.</p>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3">Important Information</h3>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>Please verify that your shipping address is accurate before submitting payment. Once an order has been processed or shipped, address changes may not be possible.</li>
                <li>Oversized, heavy, fragile, or specialty items may require additional shipping, handling, insurance, or freight charges. If additional fees apply, you will be contacted for approval before your order is shipped.</li>
                <li>We are not responsible for shipping delays caused by weather, carrier service interruptions, incorrect or incomplete shipping information provided by the buyer, or other circumstances beyond our control.</li>
              </ul>
            </div>

            <div className="mb-0">
              <div className="mb-4 flex items-center gap-3 border-b border-[#dce6f5] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <RefreshCcw className="h-5 w-5" />
                </div>
                <h2 className="!mb-0 !mt-0 text-2xl font-bold text-[#111827]">Return & Refund Policy</h2>
              </div>
              <p className="text-[#374151]">
                We strive to provide accurate descriptions and quality service for every item we sell. If you receive an eligible item that does not match its listing or has an undisclosed issue, we are committed to resolving the problem quickly and fairly.
              </p>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3">Eligible Returns</h3>
              <p className="text-[#374151]">You may request a return and refund if the item you received is:</p>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>Materially different from its auction description.</li>
                <li>Misrepresented in the listing.</li>
                <li>Defective due to an undisclosed condition.</li>
                <li>Missing significant parts or accessories that were described as included.</li>
              </ul>
              <p className="text-[#374151]">All return requests must be submitted within the time period specified in your purchase confirmation or as otherwise stated on the item listing.</p>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3">Items Not Eligible for Return</h3>
              <p className="text-[#374151]">The following items are sold as final sale and are not eligible for returns or refunds unless required by applicable law:</p>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>Items clearly marked As-Is.</li>
                <li>Items listed as Damaged.</li>
                <li>Items listed For Parts or Not Working.</li>
                <li>Any condition that was accurately disclosed in the auction listing, photographs, or item description before purchase.</li>
              </ul>
              <p className="italic text-[#6b7280]">By placing a bid on these items, you acknowledge and accept their stated condition.</p>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3">How to Request a Return</h3>
              <p className="text-[#374151]">To initiate a return:</p>
              <ol className="list-decimal space-y-2 text-[#374151] pl-5">
                <li>Navigate to the Returns section from the main menu.</li>
                <li>Select <strong>Start a Return</strong>.</li>
                <li>Choose the applicable order.</li>
                <li>Provide a detailed explanation of the issue.</li>
                <li>Upload clear photographs showing the defect or discrepancy to support your claim.</li>
                <li>Submit your request for review.</li>
              </ol>
              <p className="text-[#374151] mt-2">Providing complete and accurate information will help us process your request more quickly.</p>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3">Return Review Process</h3>
              <p className="text-[#374151]">Once your request has been received, our Customer Support team will carefully review the information and determine whether the item qualifies under our Return & Refund Policy.</p>
              <p className="text-[#374151]">If your return is approved:</p>
              <ul className="list-disc space-y-2 text-[#374151] pl-5">
                <li>You will receive detailed return instructions.</li>
                <li>A prepaid return shipping QR code or shipping label (when applicable) will be provided.</li>
                <li>The returned item must match the condition described in your return request and include all original components, accessories, and packaging, when available.</li>
              </ul>
              <p className="text-[#374151]">Returns may be denied if the item has been altered, damaged after delivery, or does not match the reported issue.</p>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3">Refund Processing</h3>
              <p className="text-[#374151]">After we receive and inspect the returned item, we will notify you of the outcome.</p>
              <p className="text-[#374151]">If your return is approved, your refund will be issued to the original payment method within <strong>1–2 business days</strong> after the inspection is completed. Depending on your financial institution, it may take additional time for the refunded amount to appear on your account.</p>

              <h3 className="text-xl font-semibold text-[#1f2937] mt-6 mb-3">Additional Information</h3>
              <p className="text-[#374151]">We reserve the right to deny any return request that does not meet the requirements of this policy or that is determined to be fraudulent or abusive.</p>
              <p className="text-[#374151]">If you have any questions regarding a return, our Customer Support team is available to assist you throughout the process.</p>
            </div>
            
          </div>
        </section>
      </div>
    </main>
  );
}
