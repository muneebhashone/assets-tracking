"use server";

import { auth } from "@/lib/auth-options";
import { City, Country } from "country-state-city";
import { redirect } from "next/navigation";

export const getAllCountry = () => {
  return Country.getAllCountries();
};

export const getCityOfCountry = (countryIso: string) => {
  return City.getCitiesOfCountry(countryIso);
};

export const submitHandler = async (formData: FormData) => {
  const [carrier, tracking_number] = Array(
    formData.get("carrier"),
    formData.get("tracking_number"),
  );

  const session = await auth();

  if (session?.user) {
    redirect(
      `/dashboard/shipment/?carrier=${carrier}&tracking_number=${tracking_number}`,
    );
  } else {
    redirect(`/signin/?carrier=${carrier}&tracking_number=${tracking_number}`);
  }
};
