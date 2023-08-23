import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
import { type ITask } from "~/components/Task";

type InitialState = {
  taskList: ITask[]
  updateTaskList: (taskList: ITask[]) => void;
}

const initialState = {
  taskList: [] as ITask[],
}

export const store = create(
  persist<InitialState>((set) => ({
      taskList: [],
      updateTaskList: (taskList: ITask[]) => set((state: InitialState) => ({
        ...state,
        taskList
      })),
    }),
    {
      name: 'task-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  ),
)


export const useHydratedStore = <T extends keyof OmittedFunctionKeys<InitialState>>(key: T)
  : OmittedFunctionKeys<InitialState>[T] => {
  const [state, setState] = useState(initialState[key]);
  const zustandState = store((persistedState) => persistedState[key]);

  useEffect(() => {
    setState(zustandState);
  }, [zustandState]);

  return state;
};