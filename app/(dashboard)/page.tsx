import CollectionList from "@/components/CollectionList";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();

  if (!user) return null;

  return (
    <div className="flex flex-col w-full space-y-6">
      <h1 className="text-4xl font-bold">
        Welcome, <br /> {user.firstName} {user.lastName}
      </h1>

      <CollectionList />
    </div>
  );
}
