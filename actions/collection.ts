// server action, serverside function that can run directly from the client
// without the need to create API endpoints

"use server";

import { prisma } from "@/lib/prisma";
import { createCollectionSchemaType } from "@/schema/createCollection";
import { currentUser } from "@clerk/nextjs";

export async function createCollection(form: createCollectionSchemaType) {
  // avoid error currentUser can only be used in a server environment
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to create a collection.");
  }

  return await prisma.collection.create({
    data: {
      userId: user.id,
      name: form.name,
      color: form.color,
    },
  });
}

export async function deleteCollection(id: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to delete a collection.");
  }

  return await prisma.collection.delete({
    where: {
      id: id,
      userId: user.id,
    },
  });
}
