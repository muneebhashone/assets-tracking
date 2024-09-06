import Image from "next/image";
import Link from "next/link";
import React from "react";
interface Props {
  link: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}

const NavLogo = ({ link, src, width, height, alt }: Props) => {
  return (
    <Link href={link}>
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        className="md:w-[90px] md:h-[90px]"
      ></Image>
    </Link>
  );
};

export default NavLogo;
