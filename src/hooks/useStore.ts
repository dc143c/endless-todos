
type GetFunctionKeys<T> = {
  [K in keyof T]: T[K] extends ((...args: any[]) => void) ? K : never;
}[keyof T];

type OmittedFunctionKeys<T> = Omit<T, GetFunctionKeys<T>>;

type StoreState = {
  fishes: number,
  addAFish: () => void,
};

const initialStates = {
  fishes: 0,
};

const usePersistedStore = create<StoreState>()(
  persist(
    (set, get) => ({
      fishes: initialStates.fishes,
      addAFish: () => set({ fishes: get().fishes + 1 }),
    }),
    {
      name: 'food-storage',
      getStorage: () => localStorage,
    },
  ),
);

const useHydratedStore = <T extends keyof OmittedFunctionKeys<StoreState>>(key: T)
  : OmittedFunctionKeys<StoreState>[T] => {
  const [state, setState] = useState(initialStates[key]);
  const zustandState = usePersistedStore((persistedState) => persistedState[key]);

  useEffect(() => {
    setState(zustandState);
  }, [zustandState]);

  return state;
};