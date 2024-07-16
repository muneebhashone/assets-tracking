import React from "react";

interface IFaq {
  id: number;
  number: string;
  text?: string;
  description: string;
  bgcolor: string;
}
const FaqSectionBox = ({ Faqbox }: { Faqbox: IFaq[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Faqbox?.map((item) => (
        <div key={item.id} className="col-span-1">
          <div className={`text-center rounded-xl py-12 ${item.bgcolor}`}>
            <div>
              <span className="text-5xl font-semibold text-white">
                {item.number}
              </span>
              <span className="text-3xl font-semibold text-white">
                {item.text}
              </span>
            </div>
            <p className="text-xl font-semibold mt-3 text-white">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FaqSectionBox;
