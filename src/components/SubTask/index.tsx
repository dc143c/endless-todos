import { BiMove } from "react-icons/bi";

const SubTask = ({
  taskId,
  taskName,
  isCompleted,
  parentId,
  onClick,
  onDragStart,
  onInputChange
}: ISubTaskElement) => {
  return (
    <div id={`${taskId}`} draggable="true" onDragStart={onDragStart}>
      <div className="flex gap-2 items-center text-[18px]">
        <div className="flex items-center gap-2 w-[95%]">
          <input title="task" type="checkbox" id="task" className="
            relative peer shrink-0
            appearance-none w-4 h-4 border-3 border-charcoal-600 rounded-full bg-charcoal-600
            checked:bg-charcoal-800 checked:border-4
            peer"
            readOnly
            checked={isCompleted}
            onClick={onClick}
          />
          <input
          title="taskName"
          className="w-full focus:outline-none pt-0.5 peer-checked:line-through bg-transparent"
          onChange={(ev) => onInputChange(ev.target.value, taskId, parentId)}
          value={taskName}
          >
          </input>
        </div>
        <div className="w-[5%]">
              <BiMove size={20} />
            </div>
      </div>
    </div>
  )
}

type ISubTaskElement = {
    taskId: number
    taskName: string,
    isCompleted: boolean
    parentId: number
    onClick: () => void;
    onInputChange: (newTaskName: string, taskId: number, parentTaskId: number) => void;
    onDragStart: () => void;
    children: React.ReactNode
}

export default SubTask;