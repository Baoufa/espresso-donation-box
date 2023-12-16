import Main from "@/components/Main";
import { getDonation } from "@/hooks/useContract/service";

async function Page() {
  let donation = await getDonation(3600);

  return <Main donation={donation} />;
}

export default Page;
