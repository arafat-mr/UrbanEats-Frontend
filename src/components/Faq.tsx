"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "How do I place an order?",
    answer:
      "Simply browse our meals, add your favorites to the cart, and proceed to checkout. Your order will be confirmed instantly and delivered to your doorstep.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Currently, we accept Cash on Delivery only. Payment is made when your meal is delivered.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "Once an order is under preparing, it cannot be canceled or modified. Please double-check your order before confirming.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery time depends on your location, but we aim to deliver your meals as quickly as possible while ensuring freshness.",
  },
  {
    question: "Are your meals fresh?",
    answer:
      "Absolutely! All our meals are prepared fresh daily using high-quality ingredients to ensure premium taste and hygiene.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false); 
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true); // only after client mount
  }, []);

  if (!mounted) return null; // avoid SSR render mismatch

  const isDark = resolvedTheme === "dark";

  return (
    <section className="py-16 flex justify-center">
      <div className="w-full max-w-4xl px-6 md:px-0 space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-xl overflow-hidden transition-shadow duration-300 ${
                isDark
                  ? "bg-gray-800 border-gray-700 shadow-md hover:shadow-xl text-white"
                  : "bg-white border-gray-200 shadow-md hover:shadow-xl text-gray-900"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-4 text-left font-medium text-lg focus:outline-none"
              >
                {faq.question}
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`px-4 pb-4 text-sm md:text-base transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
