import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import HomePage from "@/components/HomePage";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const revalidate = 0;

export default async function Home() {
  const payload = await getPayload({ config: configPromise });
  const berandaData = await payload.findGlobal({ slug: "beranda" });
  
  const { docs: articles } = await payload.find({
    collection: "articles",
    where: {
      status: {
        equals: "published",
      },
    },
    sort: "-publishedAt",
    limit: 3,
  });

  const { docs: teamMembers } = await payload.find({
    collection: "team-members",
    limit: 4,
    sort: "order",
  });

  return (
    <>
      <Navbar />
      <HomePage articles={articles} teamMembers={teamMembers} berandaData={berandaData} />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
