import { nanoid } from "nanoid";
import React, { createContext, useContext, useEffect, useState } from "react";

const WidgetContext = createContext();

const gridSize = 20; // Define a grid size for snapping

// const defaultData = {
//   container: null,
//   // containers: [
//   //   {
//   //     containerId: nanoid(),
//   //     height: 500,
//   //     width: 500,
//   //     // position: { x: 50, y: 50 }, // Position relative to the canvas
//   //     position: { x: 1, y: 50 }, // Position relative to the canvas
//   //     widgets: [
//   //       { widgetId: nanoid(), type: "A", position: { x: 1, y: 1 }, width: 250, height: 100 },
//   //       { widgetId: nanoid(), type: "B", position: { x: 200, y: 100 }, width: 150, height: 100 },
//   //     ],
//   //   },
//   //   {
//   //     containerId: nanoid(),
//   //     height: 500,
//   //     width: 500,
//   //     position: { x: 600, y: 200 },
//   //     widgets: [{ widgetId: nanoid(), type: "C", position: { x: 20, y: 20 }, width: 150, height: 100 }],
//   //   },
//   // ],
// };

export const WidgetProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [draggingWidget, setDraggingWidget] = useState(null);

  const snapToGrid = (value) => Math.round(value / gridSize) * gridSize;

  //***********************Add a widget or panel *************************************************/
  const addWidget = (widgetType, position) => {
    if (!data) return;
    setData((prevData) => {
      const newWidget = { widgetId: nanoid(), type: "A", position: { x: 20, y: 20 }, width: 250, height: 100 };
      return {
        ...prevData,
        containers: prevData.containers.map((container) => {
          if (
            position.x >= container.position.x &&
            position.x <= container.position.x + container.width &&
            position.y >= container.position.y &&
            position.y <= container.position.y + container.height
          ) {
            return {
              ...container,
              widgets: [...container.widgets, newWidget],
            };
          }
          return container;
        }),
      };
    });
  };

  const addPanel = (position) => {
    if (data) {
      setData((prevData) => ({
        ...prevData,
        containers: [
          ...prevData.containers,
          {
            containerId: nanoid(),
            position,
            width: 500,
            height: 500,
            widgets: [],
          },
        ],
      }));
    } else {
      setData({
        containers: [
          {
            containerId: nanoid(),
            position,
            width: 500,
            height: 500,
            widgets: [],
          },
        ],
      });
    }
  };

  // ********************Dragging between containers******************************************
  const startDragging = (widgetId, sourceContainerId, originalPosition) => {
    setDraggingWidget({ widgetId, sourceContainerId, originalPosition });
  };

  const moveWidgetToContainer = (widgetId, oldContainerId, newContainerId, absolutePosition) => {
    if (!oldContainerId || !newContainerId) return;

    if (oldContainerId === newContainerId) {
      console.log(`Widget ${widgetId} is staying in the same container. Resetting position.`, data.containers);
      const result = data.containers.map((container) => {
        if (container.containerId === oldContainerId) {
          const widgetIndex = container.widgets.findIndex((w) => w.widgetId === widgetId);
          if (widgetIndex > -1) {
            container.widgets[widgetIndex] = { ...container.widgets[widgetIndex], position: { ...absolutePosition } };
            return container;
          }
        } else {
          return container;
        }
      });
      setData({ containers: result });

      return;
    }

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

    // Find current container and convert to absolute position
    data.containers.forEach((container) => {
      if (container.widgets.some((w) => w.widgetId === widgetId)) {
        oldContainerId = container.containerId;
        widgetAbsolutePos = getAbsolutePosition({ position: widgetRelativePos }, container);
      }
    });

    if (!widgetAbsolutePos) return;

    let maxOverlapArea = 0;
    data.containers.forEach((container) => {
      const containerBounds = {
        x: container.position.x,
        y: container.position.y,
        width: container.width,
        height: container.height,
      };

      const overlapWidth = Math.min(widgetAbsolutePos.x + widgetSize.width, containerBounds.x + containerBounds.width) - Math.max(widgetAbsolutePos.x, containerBounds.x);
      const overlapHeight = Math.min(widgetAbsolutePos.y + widgetSize.height, containerBounds.y + containerBounds.height) - Math.max(widgetAbsolutePos.y, containerBounds.y);

      const overlapArea = Math.max(0, overlapWidth) * Math.max(0, overlapHeight);

      if (overlapArea > maxOverlapArea) {
        maxOverlapArea = overlapArea;
        newContainerId = container.containerId;
      }
    });

    console.log(`Old: ${oldContainerId}, New: ${newContainerId}, Overlap: ${maxOverlapArea}`);

    // If dropped outside all containers, reset to original position
    if (!newContainerId) {
      console.log(`Widget ${widgetId} dropped outside. Resetting to original position.`);
      moveWidgetToContainer(widgetId, oldContainerId, oldContainerId, draggingWidget.originalPosition);
      return;
    }

    if (newContainerId !== oldContainerId) {
      moveWidgetToContainer(widgetId, oldContainerId, newContainerId, widgetRelativePos);
    }
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

  const updateContainerSize = (containerId, newSize, delta) => {
    setData((prev) => ({
      ...prev,
      containers: prev.containers.map((container) =>
        container.containerId === containerId
          ? {
              ...container,
              width: snapToGrid(newSize.width),
              height: snapToGrid(newSize.height),
              widgets: container.widgets.map((widget) => ({ ...widget, width: widget.width + delta.width, height: widget.height + delta.height })),
            }
          : container
      ),
    }));
  };
  useEffect(() => {
    if (data?.containers) console.log("data changed", data?.containers);
  }, [data]);

  const updateWidgetSize = (containerId, widgetId, newSize, position) => {
    setData((prev) => ({
      ...prev,
      containers: prev.containers.map((container) => {
        if (container.containerId === containerId) {
          return {
            ...container,
            widgets: container.widgets.map((widget) => {
              if (widget.widgetId === widgetId) {
                const maxWidth = container.width - widget.position.x;
                const maxHeight = container.height - widget.position.y;

                let newWidth = snapToGrid(Math.min(newSize.width, maxWidth));
                let newHeight = snapToGrid(Math.min(newSize.height, maxHeight));

                let newX = position.x;
                let newY = position.y;

                // Check if resizing would overlap with another widget
                const isColliding = container.widgets.some((otherWidget) => {
                  if (otherWidget.widgetId === widgetId) return false; // Ignore self

                  return (
                    newX < otherWidget.position.x + otherWidget.width &&
                    newX + newWidth > otherWidget.position.x &&
                    newY < otherWidget.position.y + otherWidget.height &&
                    newY + newHeight > otherWidget.position.y
                  );
                });

                // If collision detected, keep the old size
                if (isColliding) {
                  console.log("Resize blocked due to collision.");
                  return widget;
                }

                return {
                  ...widget,
                  width: newWidth,
                  height: newHeight,
                  position: isColliding ? widget.position : { x: newX, y: newY },
                };
              }
              return widget;
            }),
          };
        }
        return container;
      }),
    }));
  };

  // const updateWidgetSize = (containerId, widgetId, newSize) => {
  //   setData((prev) => ({
  //     ...prev,
  //     containers: prev.containers.map((container) => {
  //       if (container.containerId === containerId) {
  //         return {
  //           ...container,
  //           widgets: container.widgets.map((widget) =>
  //             widget.widgetId === widgetId
  //               ? {
  //                   ...widget,
  //                   width: snapToGrid(newSize.width),
  //                   height: snapToGrid(newSize.height),
  //                 }
  //               : widget
  //           ),
  //         };
  //       }
  //       return container;
  //     }),
  //   }));
  // };
  const updateWidgetPosition = (containerId, widgetId, newPosition) => {
    setData((prev) => ({
      ...prev,
      containers: prev.containers.map((container) => {
        if (container.containerId === containerId) {
          return {
            ...container,
            widgets: container.widgets.map((widget) => {
              if (widget.widgetId === widgetId) {
                const { width, height } = widget;
                let newX = snapToGrid(newPosition.x);
                let newY = snapToGrid(newPosition.y);

                // ✅ Keep within container boundaries
                newX = Math.max(0, Math.min(container.width - width, newX));
                newY = Math.max(0, Math.min(container.height - height, newY));

                // ✅ Check for collision
                const isColliding = (x, y) => {
                  return container.widgets.some((otherWidget) => {
                    if (otherWidget.widgetId === widgetId) return false; // Ignore self
                    return (
                      x < otherWidget.position.x + otherWidget.width && x + width > otherWidget.position.x && y < otherWidget.position.y + otherWidget.height && y + height > otherWidget.position.y
                    );
                  });
                };

                // ❌ If collision detected, find nearest available space
                if (isColliding(newX, newY)) {
                  console.log("Collision detected! Finding new position...");

                  let foundSpace = false;
                  let attemptX = newX,
                    attemptY = newY;
                  let step = snapToGrid(10); // Move in grid steps
                  let maxAttempts = (container.width * container.height) / (step * step); // Prevent infinite loop

                  for (let i = 0; i < maxAttempts && !foundSpace; i++) {
                    // Try shifting right
                    if (attemptX + width <= container.width && !isColliding(attemptX + step, attemptY)) {
                      attemptX += step;
                      foundSpace = true;
                    }
                    // Try shifting down
                    else if (attemptY + height <= container.height && !isColliding(attemptX, attemptY + step)) {
                      attemptY += step;
                      foundSpace = true;
                    }
                    // Try shifting left
                    else if (attemptX - step >= 0 && !isColliding(attemptX - step, attemptY)) {
                      attemptX -= step;
                      foundSpace = true;
                    }
                    // Try shifting up
                    else if (attemptY - step >= 0 && !isColliding(attemptX, attemptY - step)) {
                      attemptY -= step;
                      foundSpace = true;
                    }
                  }

                  if (foundSpace) {
                    newX = attemptX;
                    newY = attemptY;
                    console.log("New position found at:", newX, newY);
                  } else {
                    console.log("No available space found, keeping original position.");
                    return widget;
                  }
                }

                // ✅ Update position if no collision
                return {
                  ...widget,
                  position: { x: newX, y: newY },
                };
              }
              return widget;
            }),
          };
        }
        return container;
      }),
    }));
  };

  // const updateWidgetPosition = (containerId, widgetId, newPosition) => {
  //   setData((prev) => ({
  //     ...prev,
  //     containers: prev.containers.map((container) => {
  //       if (container.containerId === containerId) {
  //         return {
  //           ...container,
  //           widgets: container.widgets.map((widget) => (widget.widgetId === widgetId ? { ...widget, position: { x: snapToGrid(newPosition.x), y: snapToGrid(newPosition.y) } } : widget)),
  //         };
  //       }
  //       return container;
  //     }),
  //   }));
  // };

  return (
    <WidgetContext.Provider
      value={{
        data,
        startDragging,
        draggingWidget,
        setDraggingWidget,
        detectNewContainer,
        moveWidgetToContainer,
        updateContainerPosition,
        updateWidgetPosition,
        updateContainerSize,
        updateWidgetSize,
        snapToGrid,
        addWidget,
        addPanel,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidgetContext = () => useContext(WidgetContext);
