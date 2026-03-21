import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { LandingView } from "@/views/landing";

const RootPage = async () => {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <LandingView />;
};

export default RootPage;
