import { useDrop } from 'react-dnd';
import { useState, forwardRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import DraggableWidget from './DraggableWidget';

// Wrap container with forwardRef for react-draggable compatibility
const DroppableContainer = forwardRef((props, ref) => {
  const [widgets, setWidgets] = useState([]);
  const [containerSize, setContainerSize] = useState({ width: 400, height: 500 });

  // Drop functionality
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'WIDGET',
    drop: (item) => addWidget(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addWidget = (item) => {
    setWidgets((prevWidgets) => [...prevWidgets, item]);
  };

  // Handle resizing
  const handleResize = (event, { size }) => {
    setContainerSize({ width: size.width, height: size.height });
  };

  return (
   <>
    <Draggable nodeRef={ref}>
      <ResizableBox
        width={containerSize.width}
        height={containerSize.height}
        minConstraints={[200, 200]}
        maxConstraints={[800, 800]}
        onResize={handleResize}
      >
        <div
          ref={(node) => {
            drop(node);
            if (ref) ref.current = node;
          }}
          style={{
            width: '100%',
            height: '100%',
            border: '2px dashed black',
            backgroundColor: isOver ? 'lightblue' : 'white',
            padding: '10px',
            overflow: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {widgets.length === 0 ? <p>Drop widgets here</p> : null}
          {widgets.map((widget, index) => (
            <DraggableWidget key={index} id={widget.id} name={widget.name} />
          ))}
        </div>
      </ResizableBox>
    </Draggable>

    <Draggable nodeRef={ref}>
      <ResizableBox
        width={containerSize.width}
        height={containerSize.height}
        minConstraints={[200, 200]}
        maxConstraints={[800, 800]}
        onResize={handleResize}
      >
        <div
          ref={(node) => {
            drop(node);
            if (ref) ref.current = node;
          }}
          style={{
            width: '100%',
            height: '100%',
            border: '2px dashed black',
            backgroundColor: isOver ? 'lightblue' : 'white',
            padding: '10px',
            overflow: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {widgets.length === 0 ? <p>Drop widgets here</p> : null}
          {widgets.map((widget, index) => (
            <DraggableWidget key={index} id={widget.id} name={widget.name} />
          ))}
        </div>
      </ResizableBox>
    </Draggable>
    <Draggable nodeRef={ref}>
      <ResizableBox
        width={containerSize.width}
        height={containerSize.height}
        minConstraints={[200, 200]}
        maxConstraints={[800, 800]}
        onResize={handleResize}
      >
        <div
          ref={(node) => {
            drop(node);
            if (ref) ref.current = node;
          }}
          style={{
            width: '100%',
            height: '100%',
            border: '2px dashed black',
            backgroundColor: isOver ? 'lightblue' : 'white',
            padding: '10px',
            overflow: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {widgets.length === 0 ? <p>Drop widgets here</p> : null}
          {widgets.map((widget, index) => (
            <DraggableWidget key={index} id={widget.id} name={widget.name} />
          ))}
        </div>
      </ResizableBox>
    </Draggable>
   </>
  );
});

// Export with forwardRef
export default DroppableContainer;
