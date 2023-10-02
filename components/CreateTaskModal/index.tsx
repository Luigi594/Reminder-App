"use client";

import { Collection } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from "@/lib/utils";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { createTaskSchema, createTaskSchemaType } from "@/schema/createTask";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { createTask } from "@/actions/tasks";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  collection: Collection;
}

function CreateTaskModal({ open, setOpen, collection }: Props) {
  const openChangeWrapper = (value: boolean) => {
    setOpen(value);
    form.reset();
  };

  const router = useRouter();

  const form = useForm<createTaskSchemaType>({
    defaultValues: {
      collectionId: collection.id,
    },
    resolver: zodResolver(createTaskSchema),
  });

  const handleOnSubmit = async (data: createTaskSchemaType) => {
    try {
      await createTask(data);

      openChangeWrapper(false);

      toast({
        title: "Task created!",
        description: "Your task has been created successfully.",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong...",
        description: "Your task could not be created.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={openChangeWrapper}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            Adding tasks to collection{" "}
            <span
              className={cn(
                "p-[1px] bg-clip-text text-transparent",
                CollectionColors[collection.color as CollectionColor]
              )}
            >
              {collection.name}
            </span>
          </DialogTitle>

          <DialogDescription>
            Add a task to your collection. You can add as many tasks as you
            want.
          </DialogDescription>
        </DialogHeader>

        <div className="gap-4 py-4">
          <Form {...form}>
            <form className="space-y-4 flex flex-col">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Task content here"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires at</FormLabel>

                    <FormDescription>
                      When should this task expire?
                    </FormDescription>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value && format(field.value, "PPP")}
                            {!field.value && <span>No expiration</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date <= new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button
            className={cn(
              "w-full dark:text-white text-white",
              CollectionColors[collection.color as CollectionColor]
            )}
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(handleOnSubmit)}
          >
            Confirm
            {form.formState.isSubmitting && (
              <ReloadIcon className="animate-spin h-4 w-4 ml-2" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTaskModal;
