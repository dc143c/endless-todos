import { BiMove } from 'react-icons/bi';

const Task = ({
  draggable,
  taskId,
  taskName,
  isCompleted,
  onClick,
  onInputChange,
  onDragStart,
  onDragOver,
  onDrop,
  children
}: ITaskElement) => {
  const childrenCount = String(children).length;
  return (
    <div id={`${taskId}`} className="flex flex-col bg-charcoal-700 rounded-md p-3" draggable={draggable} onDragStart={draggable && onDragStart ? (ev) => onDragStart(taskId, 0, 0) : undefined}>
        <div className="flex items-center justify-between z-3">
           <div className="flex items-center gap-2 w-[95%]">
              <input title="task" type="checkbox" id="task" className="
                relative peer shrink-0
                appearance-none w-4 h-4 border-3 border-charcoal-600 rounded-full bg-charcoal-600
                checked:bg-charcoal-800 checked:border-4
                peer"
                readOnly
                checked={isCompleted}
                onClick={(ev) => onClick(taskId)}
              />
              <input
              title="taskName"
              className="w-full focus:outline-none pt-0.5 peer-checked:line-through bg-transparent"
              value={taskName}
              onChange={(ev) => onInputChange(ev.target.value, taskId)}
              ></input>
            </div>
            {draggable && (
              <div className="w-[5%]">
                <BiMove size={20} />
              </div>
            )}
        </div>
        <div className="z-15 mt-2 rounded-md w-full pl-6 p-3 border border-dashed border-charcoal-600 text-sm text-center" id={`${taskId}-subtasks`} onDrop={onDrop} onDragOver={onDragOver}>
          {childrenCount > 0 ? children : 'Drag and Drop a Task for transforming it to a SubTask'}
        </div>
      </div>
  )
}

export type ITask = {
    taskId: number
    taskName: string,
    isCompleted: boolean
    parentId: number
}

export type IParentTask = {
  taskId: number
  taskName: string,
  isCompleted: boolean
  children: ITask[]
  parentId: number
}

type ITaskElement = {
    draggable: boolean
    taskId: number
    taskName: string,
    isCompleted: boolean
    onClick: (id: number) => void;
    onInputChange: (newTaskName: string, taskId: number) => void;
    onDrop?: (event: DragEvent) => void;
    onDragOver?: (event: DragEvent) => void;
    onDragStart?: (taskId: number, parentId: number, actualParent: number) => void;
    children: React.ReactNode
}

export default Task;