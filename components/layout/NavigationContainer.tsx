"use server";

import ClientNavigation from "./ClientNavigation";
import { getCurrentUser } from "@/lib/actions/user/getCurrentUser";

export default async function NavigationContainer() {
  const user = await getCurrentUser();

  return <ClientNavigation user={user} />;
}
