import React, { createContext, useContext, useState } from "react";

const WidgetContext = createContext();

const gridSize = 20; // Define a grid size for snapping

const defaultData = {
  containers: [
    {
      containerId: "container1",
      height: 500,
      width: 500,
      position: { x: 50, y: 50 }, // Position relative to the canvas
      widgets: [
        { widgetId: "widget1", type: "A", position: { x: 10, y: 10 }, width: 150, height: 100 },
        { widgetId: "widget2", type: "B", position: { x: 200, y: 100 }, width: 150, height: 100 },
      ],
    },
    {
      containerId: "container2",
      height: 500,
      width: 500,
      position: { x: 300, y: 200 },
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
  const moveWidgetToContainer = (widgetId, sourceContainerId, targetContainerId) => {
    setData((prevContainers) => {
      const newContainers = [...prevContainers];

      const sourceContainer = newContainers.find((c) => c.containerId === sourceContainerId);
      const targetContainer = newContainers.find((c) => c.containerId === targetContainerId);

      if (!sourceContainer || !targetContainer) return prevContainers;

      // Find the widget and remove it from the source container
      const widgetIndex = sourceContainer.widgets.findIndex((w) => w.widgetId === widgetId);
      if (widgetIndex === -1) return prevContainers;

      const [widget] = sourceContainer.widgets.splice(widgetIndex, 1);
      targetContainer.widgets.push(widget);

      return newContainers;
    });

    setDraggingWidget(null);
  };

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
    <WidgetContext.Provider value={{ data, startDragging, draggingWidget, moveWidgetToContainer, updateContainerPosition, updateWidgetPosition, updateContainerSize, updateWidgetSize, snapToGrid }}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidgetContext = () => useContext(WidgetContext);
