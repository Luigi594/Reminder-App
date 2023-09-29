"use client";

import React, { useState } from "react";
import { Collection, Task } from "@prisma/client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { deleteCollection } from "@/actions/collection";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import CreateTaskModal from "../CreateTaskModal";
import TaskCard from "../TaskCard";

interface Props {
  collection: Collection & {
    tasks: Task[];
  };
}

function CollectionCard({ collection }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const router = useRouter();

  const removeCollection = async () => {
    try {
      await deleteCollection(collection.id);

      toast({
        title: "Collection deleted",
        description: "Your collection has been deleted successfully.",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong...",
        description: "Your collection could not be deleted.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <CreateTaskModal
        open={showCreateModal}
        setOpen={setShowCreateModal}
        collection={collection}
      />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(
              "flex justify-between p-6 w-full",
              isOpen && "rounded-b-none",
              CollectionColors[collection.color as CollectionColor]
            )}
          >
            <span className="text-white font-bold">{collection.name}</span>

            {!isOpen && <CaretDownIcon className="h-6 w-6" />}
            {isOpen && <CaretUpIcon className="h-6 w-6" />}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="flex rounded-b-md flex-col dark:bg-neutral-900 shadow-lg">
          {collection.tasks.length > 0 ? (
            <>
              <Progress className="rounded-none" value={45} />
              <div className="flex flex-col p-4 gap-4">
                {collection.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </>
          ) : (
            <Button
              variant={"ghost"}
              className="flex items-center justify-center gap-1 p-8 py-12 rounded-none"
              onClick={() => setShowCreateModal(true)}
            >
              <p>There are no tasks yet:</p>
              <span className="underline decoration-slate-400">
                Go ahead and create one
              </span>
            </Button>
          )}

          <Separator />

          <footer className="h-10 px-4 p-[2px] text-xs text-neutral-500 flex items-center justify-between">
            <p>Created at {collection.createdAt.toDateString()}</p>

            <div>
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => setShowCreateModal(!showCreateModal)}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size={"icon"} variant={"ghost"}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogTitle>
                    Are you sure you want to delete this collection?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    This action cannot be undone. this will permanently delete
                    your collection, including all tasks inside of it.
                  </AlertDialogDescription>

                  <AlertDialogFooter>
                    <AlertDialogAction onClick={() => removeCollection()}>
                      Proceed
                    </AlertDialogAction>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </footer>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}

export default CollectionCard;
