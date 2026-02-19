import ShareContactClient from "./share-contact-client";

type ShareContactPageProps = {
  searchParams: Promise<{
    name?: string;
    email?: string;
    phone?: string;
  }>;
};

export default async function ShareContactPage({ searchParams }: ShareContactPageProps) {
  const params = await searchParams;

  return (
    <ShareContactClient
      name={(params.name || "Shared Contact").trim()}
      email={(params.email || "").trim()}
      phone={(params.phone || "").trim()}
    />
  );
}
