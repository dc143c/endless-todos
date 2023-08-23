
const Task = ({
  taskId,
  taskName,
  isCompleted,
  onClick
}: ITaskElement) => {
  return (
    <div className="flex gap-2 items-center">
      <input title="task" type="checkbox" id="task" className="
        relative peer shrink-0
        appearance-none w-4 h-4 border-3 border-charcoal-600 rounded-full bg-charcoal-600
        checked:bg-charcoal-800 checked:border-4
        peer
        "
        readOnly
        checked={isCompleted}
        onClick={(ev) => onClick(taskId)}
      />
      <label htmlFor="task" className="pt-0.5 peer-checked:line-through">{taskName}</label>
    </div>
  )
}

export type ITask = {
    taskId: number
    taskName: string,
    isCompleted: boolean
}


type ITaskElement = {
    taskId: number
    taskName: string,
    isCompleted: boolean
    onClick: (id: number) => void;
}

export default Task;