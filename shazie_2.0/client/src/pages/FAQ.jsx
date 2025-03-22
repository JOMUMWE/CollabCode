import { useState } from "react";
import NAV from "../components/NAV";
import Footer from "../components/Footer";

export default function FAQ() {
  const faqs = [
    {
      question: "What is CollabCode?",
      answer:
        "CollabCode is a real-time collaborative coding platform that allows teams to work together on the same codebase seamlessly.",
    },
    {
      question: "How do I create a new project?",
      answer:
        "To create a new project, navigate to the Projects page and click on the 'Create Project' button. Fill in the required details and submit.",
    },
    {
      question: "Can I integrate CollabCode with GitHub?",
      answer:
        "Yes, CollabCode supports integration with GitHub and GitLab for seamless version control and collaboration.",
    },
    {
      question: "Is my code secure on CollabCode?",
      answer:
        "Absolutely! CollabCode uses industry-standard encryption and security measures to ensure your code is safe and private.",
    },
    {
      question: "What file formats are supported?",
      answer:
        "CollabCode supports a variety of file formats, including .js, .java, .py, .ts, .html, .css, and more.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-6">
        <NAV />
      <div className="max-w-4xl mx-auto my-16 sm:my-20">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {faq.question}
                </h2>
                <span className="text-gray-500">
                  {openIndex === index ? "-" : "+"}
                </span>
              </div>
              {openIndex === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
