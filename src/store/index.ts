import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
import { type IParentTask } from "~/components/Task";

type InitialState = {
  taskList: IParentTask[]
  taskCount: number
  updateTaskList: (taskList: IParentTask[]) => void;
  incrementCount: () => void;
}

const initialState = {
  taskList: [] as IParentTask[],
  taskCount: 0
}

export const store = create(
  persist<InitialState>((set) => ({
      taskList: [],
      taskCount: 0,
      updateTaskList: (taskList: IParentTask[]) => set((state: InitialState) => ({
        ...state,
        taskList
      })),
      incrementCount: () => set((state: InitialState) => ({
        ...state,
        taskCount: state.taskCount + 1
      }))
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