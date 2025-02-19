import { useDrag } from 'react-dnd';

const DraggableWidget = ({ id, name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'WIDGET',
    item: { id, name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        padding: '10px',
        margin: '5px',
        backgroundColor: isDragging ? 'lightgray' : 'white',
        border: '1px solid black',
        cursor: 'move',
      }}
    >
      {name}
    </div>
  );
};

export default DraggableWidget;
