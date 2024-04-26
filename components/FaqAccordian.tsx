import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface FaqType {
  id: number;
  title: string;
  content: string;
  value: string;
}

const FaqAccordian = ({ faqaccordian }: { faqaccordian: FaqType[] }) => {
  return (
    <Accordion type="single" collapsible className="w-full mt-5">
      {faqaccordian.map((item) => (
        <AccordionItem key={item.id} value={item.value} className="">
          <AccordionTrigger className="text-[#424D5F] text-base font-semibold px-8 py-6 bg-white">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="px-8 text-[#424D5F] bg-white">
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FaqAccordian;
