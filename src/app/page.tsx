import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import HomePage from "@/components/HomePage";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export default async function Home() {
  const payload = await getPayload({ config: configPromise });
  
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

  return (
    <>
      <Navbar />
      <HomePage articles={articles} />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
