import Link from "next/link";
import React from "react";

interface Props {
  id: number;
  title: string;
  link: string;
}

const Menu = ({
  listitem,
  className,
}: {
  listitem: Props[];
  className: string;
}) => {
  return (
    <ul
      className={`md:flex items-center justify-center gap-16 font-medium ${className} text-center`}
    >
      {listitem.map((item) => (
        <li className="text-lg py-5 md:py-0" key={item.id}>
          <Link href={item.link}>{item.title}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Menu;
