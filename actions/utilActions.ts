"use server";

import { City, Country } from "country-state-city";

export const getAllCountry = () => {
  return Country.getAllCountries();
};

export const getCityOfCountry = (countryIso: string) => {
  return City.getCitiesOfCountry(countryIso);
};
