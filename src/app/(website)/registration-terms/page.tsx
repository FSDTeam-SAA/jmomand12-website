import type { Metadata } from "next";
import { registrationTermsText } from "@/content/registration-terms";

export const metadata: Metadata = {
  title: "Website Disclaimer & Auction Terms and Conditions | Discount Deals",
};

const title = "Website Disclaimer & Auction Terms and Conditions";
const headings = [
  "1. Auction Items",
  "2. Item Condition — “AS IS, WHERE IS”",
  "3. Bidding",
  "4. Winning Bids",
  "5. Reserve Prices",
  "6. Auction Closing and Extensions",
  "7. Technical Problems",
  "8. Payment",
  "9. Pickup and Delivery",
  "10. Unclaimed Items",
  "11. Returns and Refunds",
  "12. Product Descriptions and Retail Prices",
  "13. Bidder Accounts",
  "14. Prohibited Bidding Activity",
  "15. Bidder Privacy",
  "16. Website Content",
  "17. Intellectual Property",
  "18. Limitation of Liability",
  "19. Indemnification",
  "20. Right to Modify or Cancel Auctions",
  "21. Third-Party Services",
  "22. Electronic Communications",
  "23. Age Requirement",
  "24. Governing Law",
  "25. Changes to These Terms",
  "26. Contact Us",
] as const;

const acknowledgmentHeading = "ACKNOWLEDGMENT";
const firstSectionStart = registrationTermsText.indexOf(` ${headings[0]}`);
const acknowledgmentStart = registrationTermsText.indexOf(` ${acknowledgmentHeading}`);
const introduction = registrationTermsText.slice(title.length, firstSectionStart).trim();
const sections = headings.map((heading, index) => {
  const start = registrationTermsText.indexOf(heading);
  const next = index < headings.length - 1
    ? registrationTermsText.indexOf(headings[index + 1], start + heading.length)
    : acknowledgmentStart;

  return {
    heading,
    text: registrationTermsText.slice(start + heading.length, next).trim(),
  };
});
const acknowledgment = registrationTermsText
  .slice(acknowledgmentStart + acknowledgmentHeading.length)
  .trim();

export default function RegistrationTermsPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-10 text-[#17233b] sm:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="relative overflow-hidden rounded-[2rem] bg-[#08255a] px-6 py-12 text-white shadow-xl shadow-[#08255a]/10 sm:px-12 sm:py-16">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[42px] border-white/5" aria-hidden="true" />
          <div className="absolute -bottom-36 right-24 h-64 w-64 rounded-full bg-[#ff6b35]/10 blur-3xl" aria-hidden="true" />
          <h1 className="relative max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
        </header>

        <div className="relative mx-auto -mt-5 max-w-4xl space-y-5 pb-8 sm:space-y-6">
          <section className="rounded-2xl border border-[#e1e9f4] bg-white p-6 shadow-sm sm:p-9">
            <p className="whitespace-pre-wrap text-[15px] leading-8 text-[#394963]">{introduction}</p>
          </section>

          {sections.map(({ heading, text }) => (
            <section key={heading} className="rounded-2xl border border-[#e1e9f4] bg-white p-6 shadow-sm sm:p-9">
              <div className="mb-5 h-1 w-10 rounded-full bg-[#ff6b35]" aria-hidden="true" />
              <h2 className="text-xl font-bold tracking-tight text-[#08255a] sm:text-2xl">{heading}</h2>
              <p className="mt-4 whitespace-pre-wrap text-[15px] leading-8 text-[#394963]">{text}</p>
            </section>
          ))}

          <section className="rounded-2xl border border-[#f6cdbd] bg-[#fff5f0] p-6 sm:p-9">
            <h2 className="text-xl font-bold tracking-tight text-[#08255a] sm:text-2xl">{acknowledgmentHeading}</h2>
            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-8 text-[#394963]">{acknowledgment}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
