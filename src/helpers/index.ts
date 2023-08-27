
function dragstart_handler(ev: DragEvent) {
  ev.dataTransfer?.setData("text/plain", (ev.target as HTMLDivElement).id);
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

  ev.dataTransfer.dropEffect = "move";
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

    const data = ev.dataTransfer?.getData("text");
    console.log(Number(data), Number(target.id.split('-')[0]))
    // onChildrenAppend(Number(data), Number(target.id.split('-')[0]));
  } catch (error) {
    console.error(error)
  }
}

export {
  dragover_handler, dragstart_handler, drop_handler
};

