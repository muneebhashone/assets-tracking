import { currentUser } from "@/services/auth.services";
import { redirect } from "next/navigation";

const LandingPage = async () => {
  try {
    const user = await currentUser();
    if (user) {
      redirect("/dashboard");
    }
  } catch (error) {
    redirect("/signin");
  }

  // return (
  //   <div>
  //     <Header />
  //     <HeroSection />
  //     <main>
  //       <section className="container max-w-screen-2xl mx-auto mt-24">
  //         <div className="bg-[url('/images/midsectionbg.png')] bg-cover md:bg-contain bg-center bg-no-repeat md:h-screen">
  //           <SectionHeading
  //             title="Easiest Way of Tracking"
  //             description="All you need for the shipment tracking at one tool/place/.."
  //           />
  //           <TestimonialCardSection testimonialcard={testimoniallist} />
  //         </div>
  //       </section>
  //       <section
  //         className="container max-w-screen-2xl mx-auto mt-32"
  //         id="features"
  //       >
  //         <SectionHeading
  //           title="Explore Tracking Features"
  //           description="Save your time, reduce the cost, increase productivity and Grow With ShipsGo."
  //         />
  //         <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-16 gap-y-28 my-32">
  //           <div className="lg:col-span-2 col-span-1">
  //             <div className="flex items-center gap-5 mb-7">
  //               <NotificationIcon />
  //               <h2 className="text-xl font-semibold text-[#424D5F]">
  //                 Notification
  //               </h2>
  //             </div>
  //             <NotificationCard
  //               title="Intelligent way to keep track"
  //               description="Receive the voyage information, live position of your shipment, various notifications like on-time arrival notice, sailing and delay notifications and more."
  //               cardlist={cardlisting}
  //             />
  //           </div>
  //           <div className="lg:col-span-3 col-span-1">
  //             <Image
  //               src={"/images/features-notifications.png"}
  //               width={866}
  //               height={702}
  //               alt="img"
  //             />
  //           </div>
  //           <div className="lg:col-span-3 col-span-1">
  //             <Image
  //               src={"/images/dashboardimage.png"}
  //               width={866}
  //               height={600}
  //               alt="img"
  //               style={{ objectFit: "contain" }}
  //             />
  //           </div>
  //           <div className="lg:col-span-2 col-span-1">
  //             <NotificationCard
  //               title="All shipments at one place"
  //               description="Monitor all your shipments on easy to use dashboard. Download customized reports, create sub-accounts for your employees or clients, access statistical data of your shipments, and many more features from just one dashboard."
  //               cardlist={cardlist}
  //             />
  //           </div>
  //         </div>
  //       </section>
  //       <section className="bg-[#F1F5FE] py-32" id="faq">
  //         <div className="container max-w-screen-2xl mx-auto">
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10">
  //             <div className="col-span-1">
  //               <FaqSectionBox Faqbox={faqcardlist} />
  //             </div>
  //             <div className="col-span-1">
  //               <h2 className="text-3xl font-semibold text-[#424D5F] mb-5">
  //                 FAQ&apos;s
  //               </h2>
  //               <p className="text-lg font-normal text-[#424D5F] ">
  //                 Dont hesitate to
  //                 <Link href={"/"} className="text-[#3491FE]">
  //                   <span className="mx-2">contact with us</span>
  //                 </Link>
  //                 for your questions that you cant find the answer.
  //               </p>
  //               <FaqAccordian faqaccordian={faqaccordianlist} />
  //             </div>
  //           </div>
  //         </div>
  //       </section>
  //     </main>
  //     <MainFooter
  //       companylist={company}
  //       infolist={info}
  //       resourceslist={resources}
  //     />
  //   </div>
  // );
};

export default LandingPage;
