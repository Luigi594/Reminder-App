import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

async function CollectionList() {
  const user = await currentUser();
  const collections = await prisma.collection.findMany({
    where: {
      userId: user?.id,
    },
  });

  return (
    <>
      {collections.length > 0 ? (
        <div>CollectionList</div>
      ) : (
        <Alert className="text-center text-xl">
          <AlertTitle className="p-3">
            It seams that you have no collections yet
          </AlertTitle>
          <AlertDescription className="p-3">
            Create a collection to get started
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

export default CollectionList;
