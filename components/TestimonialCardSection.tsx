import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { DownIcon } from "@/components/Icons/index";
interface ITestimonialCard {
  id: number;
  title: string;
  description: string;
  src: string;
}
const TestimonialCardSection = ({
  testimonialcard,
}: {
  testimonialcard: ITestimonialCard[];
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-x-5 gap-y-5 py-20">
        {testimonialcard?.map((item) => (
          <div
            key={item.id}
            className="col-span-1 border border-gray-300 text-center pt-9 pb-14 px-8 rounded-xl shadow-lg bg-white"
          >
            <Image
              className="mx-auto"
              src={item.src}
              width={110}
              height={110}
              alt="notification"
            />
            <h2 className="mt-10 text-2xl text-[#424D5F] font-semibold">
              {item.title}
            </h2>
            <p className="mt-8 text-[#424D5F]">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Button className="text-[#424D5F] rounded-3xl border border-gray-400 bg-transparent hover:text-white py-6 px-7">
          More about
          <DownIcon classname="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TestimonialCardSection;
