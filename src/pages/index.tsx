import Head from "next/head";
import { useEffect, useState, type FormEvent } from "react";
import { Input, SubTask, Task } from "~/components";
import { type IParentTask, type ITask } from "~/components/Task";
import { store, useHydratedStore } from "~/store";

export default function Home(props) {
  const {updateTaskList, incrementCount} = store((state) => state)
  const [selectedTask, setSelectedTask] = useState({} as IParentTask | ITask);
  const taskList = useHydratedStore('taskList')
  const taskCount = useHydratedStore('taskCount')

  const [newTask, setNewTask] = useState<IParentTask>({
    taskName: '',
    isCompleted: false,
    parentId: 0,
    taskId: 0,
    children: [],
  })

  useEffect(() => {
    document.body.className = "bg-charcoal-700";
  });

  const handleTaskChange = (name: string) => {
    setNewTask({...newTask, taskName: name})
  }

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const newId = taskCount + 1
    updateTaskList([...taskList, {...newTask, taskId: newId}])
    incrementCount()
    setNewTask({...newTask, taskName: ''})
  }

  const handleTaskCompletion = (taskId: number) => {
    const task = taskList.find((task) => task.taskId === taskId)
    if(!task) return taskList;

    const taskIndex = taskList.indexOf(task)
    const newTaskList: IParentTask[] = taskList;
    newTaskList.splice(taskIndex, 1)
    const taskStatus = !task.isCompleted
    newTaskList.push({...task, isCompleted: taskStatus})
    updateTaskList(newTaskList)
  }

  const handleChildrenTaskCompletion = (parentTaskId: number, taskId: number) => {
    const task = taskList.find((task) => task.taskId === parentTaskId)
    if(!task) return taskList;

    const foundSubTask = task.children.find((subTask) => subTask.taskId === taskId);
    if(!foundSubTask) throw new Error('SubTask could not be found');
    const taskIndex = task.children.indexOf(foundSubTask)
    const newSubTaskList: ITask[] = task.children;
    newSubTaskList.splice(taskIndex, 1)
    const taskStatus = !foundSubTask.isCompleted
    newSubTaskList.push({...foundSubTask, isCompleted: taskStatus})

    task.children = newSubTaskList;

    const parentTaskIndex = taskList.indexOf(task)
    if(parentTaskIndex == -1) throw new Error('Task could not be found');

    const newTaskList: IParentTask[] = taskList;
    newTaskList[parentTaskIndex] = task;
    updateTaskList(newTaskList)
  }

  const handleChildrenAppend = (childrenId: number, parentId: number, actualParent: number) => {
    if(actualParent == 0 && parentId != 0) {
        const task = taskList.find((task) => task.taskId === parentId)

        if(!task) {
          console.error("Task not found")
          return;
        }
        const taskIndex = taskList.indexOf(task);

        const childrenTask = taskList.find((task) => task.taskId === childrenId)

        if(!childrenTask) {
            console.error("Children not found")
            return;
        }
        const childrenIndex = taskList.indexOf(childrenTask)

        // Set new parent_id and adding subTask
        childrenTask.parentId = parentId;
        if(task.children.length > 0) {
          task.children = [...task.children, childrenTask]
        } else {
          task.children = [childrenTask]
        }

        const newTaskList: IParentTask[] = taskList;
        newTaskList[taskIndex] = task;
        newTaskList.splice(childrenIndex, 1)
        updateTaskList(newTaskList)
        return;
    }
    if(actualParent > 0 && parentId == 0) {
      const parentTask = taskList.find((task) => task.taskId === actualParent)

      if(!parentTask) {
        console.error("Parent Task not found")
        return;
      }

      const parentTaskIndex = taskList.indexOf(parentTask);
      const subTask = parentTask.children.find((task) => task.taskId == childrenId)
      if(!subTask) {
        console.error("Sub Task not found")
        return;
      }

      const subTaskIndex = parentTask.children.indexOf(subTask);
      parentTask.children.splice(subTaskIndex, 1)
      subTask.parentId = 0;
      const newTaskList: IParentTask[] = [...taskList, subTask as IParentTask];
      newTaskList[parentTaskIndex] = parentTask;
      updateTaskList(newTaskList)
      return;
    }
    if(actualParent > 0 && parentId > 0) {
      const parentTask = taskList.find((task) => task.taskId === parentId)

      if(!parentTask) {
        console.error("Parent Task not found")
        return;
      }

      if(parentTask.children.find((task) => task.taskId == childrenId)) return;

      const parentTaskIndex = taskList.indexOf(parentTask);

      const actualParentTask = taskList.find((task) => task.taskId === actualParent)

      if(!actualParentTask) {
        console.error("Actual Parent Task not found")
        return;
      }

      const actualParentTaskIndex = taskList.indexOf(actualParentTask);

      const childrenTask = actualParentTask.children.find((task) => task.taskId === childrenId)

      if(!childrenTask) {
        console.error("Sub Task not found")
        return;
      }

      const childrenTaskIndex = actualParentTask.children.indexOf(childrenTask);

      childrenTask.parentId = parentId;

      if(parentTask.children.length > 0) {
        parentTask.children = [...parentTask.children, childrenTask]
      } else {
        parentTask.children = [childrenTask]
      }

      const newTaskList: IParentTask[] = taskList;
      newTaskList[parentTaskIndex] = parentTask;
      actualParentTask.children.splice(childrenTaskIndex, 1);
      newTaskList[actualParentTaskIndex] = actualParentTask;
      updateTaskList(newTaskList)
      return;
    }
  }

  const handleInputTaskChange = (newTaskName: string, taskId: number) => {
    const task = taskList.find((task) => task.taskId === taskId)
    if(!task) return taskList;

    const taskIndex = taskList.indexOf(task)
    const newTaskList: IParentTask[] = taskList;
    newTaskList.splice(taskIndex, 1)
    const taskName = newTaskName
    newTaskList.push({...task, taskName})
    updateTaskList(newTaskList)
  }

  const handleInputSubTaskChange = (
    newTaskName: string, taskId: number, parentTaskId: number
    ) => {
      const task = taskList.find((task) => task.taskId === parentTaskId)
      if(!task) return taskList;

      const foundSubTask = task.children.find((subTask) => subTask.taskId === taskId);
      if(!foundSubTask) throw new Error('SubTask could not be found');
      const taskIndex = task.children.indexOf(foundSubTask)
      const newSubTaskList: ITask[] = task.children;
      newSubTaskList.splice(taskIndex, 1)
      const taskName = newTaskName
      newSubTaskList.push({...foundSubTask, taskName})

      task.children = newSubTaskList;

      const parentTaskIndex = taskList.indexOf(task)
      if(parentTaskIndex == -1) throw new Error('Task could not be found');

      const newTaskList: IParentTask[] = taskList;
      newTaskList[parentTaskIndex] = task;
      updateTaskList(newTaskList)
  }

  function dragstart_handler(taskId: number, parentId: number) {
    document.querySelector('#tasks')?.classList.add('border-charcoal-900')
    document.querySelector('#tasks')?.classList.add('border')
    document.querySelector('#tasks')?.classList.add('border-dashed')

    if(parentId == 0) {
      const foundTask = taskList.find((task) => task.taskId == taskId)
      if(!foundTask) throw Error('Task not been found');
      setSelectedTask(() => foundTask)
    } else {
      const foundParentTask = taskList.find((task) => task.taskId == parentId)
      if(!foundParentTask) throw Error('Parent not been found');
      const foundTask = foundParentTask.children.find((task) => task.taskId == taskId)
      if(!foundTask) throw Error('Task not been found');
      setSelectedTask(() => foundTask)
    }
  }

  function dragover_handler(ev: DragEvent) {
    ev.preventDefault();
    const target = (ev.target as HTMLDivElement)
    const droppableAreas = document.querySelectorAll('[id*="subtasks"]');
    droppableAreas.forEach((item) => {
      if(item.id === target.id) {
        item.classList.add('border-charcoal-800');
      } else {
        item.classList.add('border-charcoal-900');
      }
    })

  }

  function drop_handler(ev: DragEvent) {
    ev.preventDefault();
    try {
      const target = (ev.target as HTMLDivElement)
      const droppableAreas = document.querySelectorAll('[id*="subtasks"]');

      droppableAreas.forEach((item) => {
        item.classList.remove('border-charcoal-800');
        item.classList.remove('border-charcoal-900');
        item.classList.add('border-charcoal-600');
      })

      handleChildrenAppend(selectedTask.taskId, Number(target.id === 'tasks' ? 0 : target.id.split('-')[0]), selectedTask.parentId);
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Head>
        <title>Endless Todos</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="content flex min-h-screen flex-col">
        <div className="bg-charcoal-800 p-5 text-center">
          <h1 className="text-2xl font-bold tracking-wide text-white">
            Endless Todos
          </h1>
        </div>
        <main className="mx-auto max-w-md justify-center pt-32 text-white">
          <form onSubmit={(ev) => handleSubmit(ev)}>
            <Input value={newTask.taskName} onChange={handleTaskChange} />
          </form>
          <div className="flex flex-col gap-2 py-2" id="tasks" onDrop={drop_handler} onDragOver={dragover_handler}>
            {taskList?.map((task) => {
              return (
              <Task key={task.taskId} {...task}
              draggable={(task.children.length == 0)}
              onClick={handleTaskCompletion}
              onDragOver={task.children.length === 0 ? dragover_handler : undefined}
              onDrop={task.children.length === 0 ? drop_handler: undefined}
              onDragStart={task.children.length === 0 ? dragstart_handler: undefined}
              onInputChange={handleInputTaskChange}>
                {
                  task?.children.map((children) => (
                    <SubTask key={children.taskId}
                    taskId={children.taskId}
                    isCompleted={children.isCompleted}
                    parentId={children.parentId}
                    taskName={children.taskName}
                    onClick={() => handleChildrenTaskCompletion(task.taskId, children.taskId)}
                    onDragStart={() => dragstart_handler(children.taskId, children.parentId)}
                    onInputChange={handleInputSubTaskChange}>
                    </SubTask>
                  ))
                }
              </Task>
            )})}
          </div>
        </main>
      </div>
    </>
  );
}
