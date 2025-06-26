import { redirect } from "next/navigation";
import { AppUpdateHandler } from "@/components/handler/AppUpdateHandler";

export default function RootPage() {
  <AppUpdateHandler />;
  redirect("/dashboard");
}
