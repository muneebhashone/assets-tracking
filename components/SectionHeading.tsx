import React from "react";

const SectionHeading = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="text-center">
      <h2 className="font-semibold text-5xl text-[#424D5F] relative before:absolute before:bg-[#3491FE] before:w-20 before:h-1 before:-bottom-4 md:before:left-1/2 before:left-[43%]">
        {title}
      </h2>

      <p className="text-xl text-[#424D5F] mt-6">{description}</p>
    </div>
  );
};

export default SectionHeading;
