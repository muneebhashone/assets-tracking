import Image from "next/image";
import React from "react";

interface Icard {
    id: number;
    title: string;
    description: string;
    src: string;
}
const NotificationCard = ({cardlist, title, description}: {cardlist: Icard[], title: string, description: string}) => {
  return (
    <div>
      <h2 className="text-4xl font-semibold text-[#424D5F]">
        {title}
      </h2>
      <p className="text-[#424D5F] text-xl mt-6">
       {description}
      </p>
      {cardlist.map((item) => (
          
      <div key={item.id} className="flex items-center gap-5 mt-10 shadow-xl rounded-xl bg-white border border-gray-300 px-6 py-6">
        <div>
          <Image
            src={item.src}
            width={66}
            height={66}
            alt="img"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#424D5F]">
           {item.title}
          </h2>
          <p className="text-[#424D5F]">
            {item.description}
          </p>
        </div>
      </div>
      ))}
    </div>
  );
};

export default NotificationCard;
