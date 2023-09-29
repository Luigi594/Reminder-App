import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import CollectionCard from "../CollectionCard";

async function CollectionList() {
  const user = await currentUser();
  const collections = await prisma.collection.findMany({
    include: {
      tasks: true,
    },
    where: {
      userId: user?.id,
    },
  });

  return (
    <>
      {collections.length > 0 ? (
        <div className="flex flex-col gap-4 mt-6">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <Alert className="text-center text-xl">
          <AlertTitle className="p-2">
            It seams that you have no collections yet
          </AlertTitle>
          <AlertDescription className="p-2">
            Create a collection to get started
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

export default CollectionList;
