type TCleanupTask = () => Promise<void> | void;

const cleanupTasks: TCleanupTask[] = [];

export const registerCleanup = (task: TCleanupTask) => {
  cleanupTasks.push(task);
};

export const runRegisteredCleanup = async () => {
  while (cleanupTasks.length > 0) {
    const task = cleanupTasks.pop();

    if (!task) {
      continue;
    }

    await task();
  }
};
