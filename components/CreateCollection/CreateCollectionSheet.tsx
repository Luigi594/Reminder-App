"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCollectionSchema,
  createCollectionSchemaType,
} from "@/schema/createCollection";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { createCollection } from "@/actions/collection";
import { toast } from "../ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function CreateCollectionSheet({ open, onOpenChange }: Props) {
  const form = useForm<createCollectionSchemaType>({
    defaultValues: {},
    resolver: zodResolver(createCollectionSchema),
  });

  const handleOnSubmit = async (data: createCollectionSchemaType) => {
    try {
      // save the data to the database
      await createCollection(data);

      toast({
        title: "Success",
        description: "Collection was added successfully",
      });

      // close the sheet and reset the form
      openChangeWrapper(false);
    } catch (error) {
      console.log(error);

      toast({
        title: "Error",
        description: "Something went wrong. Please try again later",
        variant: "destructive",
      });
    }
  };

  const openChangeWrapper = (open: boolean) => {
    form.reset();
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={openChangeWrapper}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add new collection</SheetTitle>
          <SheetDescription>
            Collections are a way to group your tasks. You can create as many
            collections as you want.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form className="flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Personal" {...field} />
                  </FormControl>

                  <FormDescription>Collection name</FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Select onValueChange={(color) => field.onChange(color)}>
                      <SelectTrigger
                        className={`${cn(
                          "w-full text-white",
                          CollectionColors[field.value as CollectionColor]
                        )}`}
                      >
                        <SelectValue
                          placeholder="color"
                          className="w-full h-8"
                        />
                      </SelectTrigger>

                      <SelectContent className="w-full">
                        {Object.keys(CollectionColors).map((color) => (
                          <SelectItem
                            key={color}
                            value={color}
                            className={`${cn(
                              `w-full h-8 rounded-md my-1 text-white focus:text-white focus:font-bold
                          focus:px-8 focus:transition-all
                          focus:ease-out focus:duration-300`,
                              CollectionColors[color as CollectionColor]
                            )}`}
                          >
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormDescription>
                    Select a color for your collection
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3 mt-4">
              <Separator />
              <Button
                onClick={form.handleSubmit(handleOnSubmit)}
                disabled={form.formState.isSubmitting}
              >
                Confirm
                {form.formState.isSubmitting && (
                  <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default CreateCollectionSheet;
