import React, { createContext, useContext, useState } from "react";

const WidgetContext = createContext();

const gridSize = 20; // Define a grid size for snapping

const defaultData = {
  containers: [
    {
      containerId: "container1",
      height: 500,
      width: 500,
      // position: { x: 50, y: 50 }, // Position relative to the canvas
      position: { x: 1, y: 50 }, // Position relative to the canvas
      widgets: [
        { widgetId: "widget1", type: "A", position: { x: 1, y: 1 }, width: 250, height: 100 },
        { widgetId: "widget2", type: "B", position: { x: 200, y: 100 }, width: 150, height: 100 },
      ],
    },
    {
      containerId: "container2",
      height: 500,
      width: 500,
      position: { x: 600, y: 200 },
      widgets: [{ widgetId: "widget3", type: "C", position: { x: 20, y: 20 }, width: 150, height: 100 }],
    },
  ],
};

export const WidgetProvider = ({ children }) => {
  const [data, setData] = useState(defaultData);
  const [draggingWidget, setDraggingWidget] = useState(null);

  const snapToGrid = (value) => Math.round(value / gridSize) * gridSize;

  // ********************Dragging between containers******************************************
  const startDragging = (widgetId, sourceContainerId) => {
    setDraggingWidget({ widgetId, sourceContainerId });
  };

  const moveWidgetToContainer = (widgetId, oldContainerId, newContainerId, absolutePosition) => {
    if (!oldContainerId || !newContainerId) return;

    setData((prevData) => {
      const oldContainer = prevData.containers.find((c) => c.containerId === oldContainerId);
      const newContainer = prevData.containers.find((c) => c.containerId === newContainerId);
      if (!oldContainer || !newContainer) return prevData;

      // Find and remove the widget from the old container
      const widgetIndex = oldContainer.widgets.findIndex((w) => w.widgetId === widgetId);
      if (widgetIndex === -1) return prevData;

      const widget = oldContainer.widgets[widgetIndex];

      // Compute relative position inside the new container
      const updatedWidget = { ...widget, position: getRelativePosition(absolutePosition, newContainer) };
      const xxx = getRelativePosition(absolutePosition, newContainer);
      debugger;

      return {
        ...prevData,
        containers: prevData.containers.map((container) => {
          if (container.containerId === oldContainerId) {
            return { ...container, widgets: container.widgets.filter((w) => w.widgetId !== widgetId) };
          }
          if (container.containerId === newContainerId) {
            return { ...container, widgets: [...container.widgets, updatedWidget] };
          }
          return container;
        }),
      };
    });

    console.log(`Widget ${widgetId} moved from ${oldContainerId} to ${newContainerId}`);
  };

  const getAbsolutePosition = (widget, container) => {
    return {
      x: container.position.x + widget.position.x,
      y: container.position.y + widget.position.y,
    };
  };

  const getRelativePosition = (absolutePos, newContainer) => {
    return {
      x: Math.max(0, absolutePos.x - newContainer.position.x), // Ensuring the widget is inside
      y: Math.max(0, absolutePos.y - newContainer.position.y),
    };
  };

  const detectNewContainer = (widgetId, widgetRelativePos, widgetSize) => {
    let oldContainerId = null;
    let newContainerId = null;
    let widgetAbsolutePos = null;

    // Step 1: Find the current container & convert widget's position to absolute
    data.containers.forEach((container) => {
      if (container.widgets.some((w) => w.widgetId === widgetId)) {
        oldContainerId = container.containerId;
        widgetAbsolutePos = getAbsolutePosition({ position: widgetRelativePos }, container);
      }
    });

    if (!widgetAbsolutePos) return; // Ensure we have a valid position

    // Step 2: Check which container overlaps most
    let maxOverlapArea = 0;

    data.containers.forEach((container) => {
      const containerBounds = {
        x: container.position.x,
        y: container.position.y,
        width: container.width,
        height: container.height,
      };

      // Check intersection using absolute positions
      const overlapWidth = Math.min(widgetAbsolutePos.x + widgetSize.width, containerBounds.x + containerBounds.width) - Math.max(widgetAbsolutePos.x, containerBounds.x);
      const overlapHeight = Math.min(widgetAbsolutePos.y + widgetSize.height, containerBounds.y + containerBounds.height) - Math.max(widgetAbsolutePos.y, containerBounds.y);

      const overlapArea = Math.max(0, overlapWidth) * Math.max(0, overlapHeight);

      if (overlapArea > maxOverlapArea) {
        maxOverlapArea = overlapArea;
        newContainerId = container.containerId;
      }
    });

    console.log(`Old: ${oldContainerId}, New: ${newContainerId}, Overlap: ${maxOverlapArea}`);

    // Step 3: Move widget only if it's in a new container
    if (newContainerId && newContainerId !== oldContainerId) {
      moveWidgetToContainer(widgetId, oldContainerId, newContainerId, widgetRelativePos);
    }
  };

  // const detectNewContainer = (widgetId, position) => {
  //   let newContainerId = null;
  //   let oldContainerId = null;

  //   data.containers.forEach((container) => {
  //     // Check if the widget currently belongs to this container
  //     if (container.widgets.some((w) => w.widgetId === widgetId)) {
  //       oldContainerId = container.containerId;
  //     }

  //     // Check if the widget is dropped inside this container
  //     const { position: newPosition, width, height, containerId } = container;
  //     const { x, y } = newPosition;
  //     debugger;
  //     if (position.x >= x && position.x <= x + width && position.y >= y && position.y <= y + height) {
  //       newContainerId = containerId;
  //     }
  //   });

  //   // If widget is in a new container, move it
  //   if (newContainerId && newContainerId !== oldContainerId) {
  //     moveWidgetToContainer(widgetId, oldContainerId, newContainerId, position);
  //   }
  // };

  // ************************Dragging and resizing*********************
  const updateContainerPosition = (containerId, newPosition) => {
    setData((prevData) => ({
      ...prevData,
      containers: prevData.containers.map((container) =>
        container.containerId === containerId ? { ...container, position: { x: snapToGrid(newPosition.x), y: snapToGrid(newPosition.y) } } : container
      ),
    }));
  };

  const updateContainerSize = (containerId, newSize) => {
    setData((prev) => ({
      ...prev,
      containers: prev.containers.map((container) =>
        container.containerId === containerId
          ? {
              ...container,
              width: snapToGrid(newSize.width),
              height: snapToGrid(newSize.height),
            }
          : container
      ),
    }));
  };

  const updateWidgetSize = (containerId, widgetId, newSize) => {
    setData((prev) => ({
      ...prev,
      containers: prev.containers.map((container) => {
        if (container.containerId === containerId) {
          return {
            ...container,
            widgets: container.widgets.map((widget) =>
              widget.widgetId === widgetId
                ? {
                    ...widget,
                    width: snapToGrid(newSize.width),
                    height: snapToGrid(newSize.height),
                  }
                : widget
            ),
          };
        }
        return container;
      }),
    }));
  };

  const updateWidgetPosition = (containerId, widgetId, newPosition) => {
    setData((prev) => ({
      ...prev,
      containers: prev.containers.map((container) => {
        if (container.containerId === containerId) {
          return {
            ...container,
            widgets: container.widgets.map((widget) => (widget.widgetId === widgetId ? { ...widget, position: { x: snapToGrid(newPosition.x), y: snapToGrid(newPosition.y) } } : widget)),
          };
        }
        return container;
      }),
    }));
  };

  return (
    <WidgetContext.Provider
      value={{ data, startDragging, draggingWidget, detectNewContainer, moveWidgetToContainer, updateContainerPosition, updateWidgetPosition, updateContainerSize, updateWidgetSize, snapToGrid }}
    >
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidgetContext = () => useContext(WidgetContext);
