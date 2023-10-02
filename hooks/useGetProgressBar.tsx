import { Collection, Task } from "@prisma/client";
import { useMemo } from "react";

interface Props {
  collection: Collection & {
    tasks: Task[];
  };
}

export default function useGetProgressBar({ collection }: Props) {
  // return the number of tasks done
  const tasksDone = useMemo(() => {
    return collection.tasks.filter((task) => task.done).length;
  }, [collection.tasks]);

  const totalTasks = collection.tasks.length;

  const progress = totalTasks === 0 ? 0 : (tasksDone / totalTasks) * 100;

  return { progress };
}
