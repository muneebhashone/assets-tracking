import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  Xicon,
  YoutubeIcon,
} from "./Icons/index";

interface CompanyType {
  id: number;
  text: string;
  link: string;
}

const MainFooter = ({
  companylist,
  resourceslist,
  infolist,
}: {
  companylist: CompanyType[];
  resourceslist: CompanyType[];
  infolist: CompanyType[];
}) => {
  return (
    <div className="bg-[#E2E8F0] py-6">
      <div className="container max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="col-span-1">
            <Image
              src={"/images/fotterlogo.png"}
              width={90}
              height={91}
              alt="logo"
            />
            <p className="font-normal text-[#424D5F] text-sm">
              Make people happy with the information.
            </p>
          </div>
          <div className="col-span-1 pt-16">
            <h2 className="text-[#424D5F] font-semibold text-lg">Company</h2>
            {companylist?.map((item) => (
              <ul key={item.id} className="mt-7">
                <li className="text-[#424D5F] mb-1 text-sm">
                  <Link href={item.link}>{item.text}</Link>
                </li>
              </ul>
            ))}
          </div>
          <div className="col-span-1 pt-16">
            <h2 className="text-[#424D5F] text-lg font-semibold">Resources</h2>
            {resourceslist?.map((item) => (
              <ul key={item.id} className="mt-7">
                <li className="text-[#424D5F] mb-1 text-sm">
                  <Link href={item.link}>{item.text}</Link>
                </li>
              </ul>
            ))}
          </div>
          <div className="col-span-1 pt-16">
            <h2 className="text-[#424D5F] text-lg font-semibold">
              Information
            </h2>
            {infolist?.map((item) => (
              <ul key={item.id} className="mt-7">
                <li className="text-[#424D5F] mb-1 text-sm">
                  <Link href={item.link}>{item.text}</Link>
                </li>
              </ul>
            ))}
            <div className="flex items-center gap-2">
              <Link href={"#"}>
                <LinkedinIcon />
              </Link>
              <Link href={"#"}>
                <Xicon />
              </Link>

              <Link href={"#"}>
                <InstagramIcon />
              </Link>

              <Link href={"#"}>
                <YoutubeIcon />
              </Link>

              <Link href={"#"}>
                <FacebookIcon />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-row md:flex justify-between items-center mt-10 text-[#424D5F]">
          <div className="flex items-center gap-10">
            <Link href={"/"}>
              <p>Privacy Policy</p>
            </Link>
            <Link href={"/"}>
              <p>faq&apos;s</p>
            </Link>
          </div>
          <div className="flex items-center gap-10">
            <p>© 2024 - Your logo </p>
            <p> from CNTR Inc. </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFooter;
