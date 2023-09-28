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
