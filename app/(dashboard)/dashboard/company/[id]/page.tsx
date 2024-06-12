import CompanyCredit, { paramsProps } from "@/components/CompanyInsert";

export default async function Page({ params }: paramsProps) {
  return <CompanyCredit params={params} />;
}
