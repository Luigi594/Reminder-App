import { Task } from "@prisma/client";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import getExpirationColor from "@/lib/getExpirationColor";
import { setTaskDone } from "@/actions/tasks";
import { useRouter } from "next/navigation";

interface Props {
  task: Task;
}

function TaskCard({ task }: Props) {
  const router = useRouter();

  const handleTaskDone = async (id: number) => {
    await setTaskDone(id);
    router.refresh();
  };

  return (
    <div className="flex gap-2 items-start">
      <Checkbox
        id={task.id.toString()}
        className="w-5 h-5"
        checked={task.done}
        disabled={task.done}
        onCheckedChange={() => handleTaskDone(task.id)}
      />
      <label
        htmlFor={task.id.toString()}
        className={cn(
          `text-sm font-medium leading-none peer-disabled:cursor-not-allowed 
          peer-disabled:opacity-70 decoration-1 dark:decoration-white`,
          task.done && "line-through"
        )}
      >
        {task.content}
        {task.expiresAt && (
          <p
            className={cn(
              "text-xs text-neutral-500 dark:text-neutral-400",
              getExpirationColor(task.expiresAt)
            )}
          >
            {format(task.expiresAt, "dd/MM/yyyy")}
          </p>
        )}
      </label>
    </div>
  );
}

export default TaskCard;
