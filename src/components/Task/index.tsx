
const Task = ({
  taskId,
  taskName,
  isCompleted,
  onClick,
  onChildrenAppend
}: ITaskElement) => {

  function dragstart_handler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
  }

  function dragover_handler(ev) {
    ev.preventDefault();
    console.log({ev})
    ev.target.classList.value = ev.target.classList.value + ' bg-white h-4 opacity-80'
    ev.dataTransfer.dropEffect = "move";
  }

  function drop_handler(ev) {
    ev.preventDefault();
    try {

      var data = ev.dataTransfer.getData("text");
      ev.target.classList.remove('bg-white');
      ev.target.classList.remove('opacity-80');
      ev.target.classList.remove('h-4');
      ev.target.appendChild(document.getElementById(data));

      onChildrenAppend(ev.target.id, data);
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div id={`${taskId}`} className="flex gap-2 items-center" draggable="true" onDragStart={dragstart_handler}>
        <input title="task" type="checkbox" id="task" className="
          relative peer shrink-0
          appearance-none w-4 h-4 border-3 border-charcoal-600 rounded-full bg-charcoal-600
          checked:bg-charcoal-800 checked:border-4
          peer"
          readOnly
          checked={isCompleted}
          onClick={(ev) => onClick(taskId)}
        />
        <input title="taskName" className="focus:outline-none pt-0.5 peer-checked:line-through bg-transparent" value={taskName}></input>
      </div>
      <div className="w-full h-3 pl-6" id={`${taskId}-subtasks`}  onDrop={drop_handler} onDragOver={dragover_handler}>
      </div>
    </div>
  )
}

export type ITask = {
    taskId: number
    taskName: string,
    isCompleted: boolean
    children: any[]
}

type ITaskElement = {
    taskId: number
    taskName: string,
    isCompleted: boolean
    onClick: (id: number) => void;
    onChildrenAppend: (childrenId: number, parentId: number) => void;
}

export default Task;