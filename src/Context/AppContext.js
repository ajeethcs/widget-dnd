import { nanoid } from "nanoid";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const WidgetContext = createContext();

const gridSize = 20; // Define a grid size for snapping

export const WidgetProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [draggingWidget, setDraggingWidget] = useState(null);

  const snapToGrid = (value) => Math.round(value / gridSize) * gridSize;

  useEffect(() => {
    console.log("data changed=", data);
  }, [data]);

  //***********************Add a widget or panel *************************************************/

  const addWidget = (widgetType, position) => {
    if (!data) return;
    function getSize(type, container) {
      debugger;
      if (type === "navBar") {
        return { width: container.width, height: 50 };
      } else if (type === "table") {
        return { width: container.width, height: 200 };
      } else {
        return { width: 100, height: 100 };
      }
    }
    function getPosition(type, position) {
      if (type === "navBar") {
        return { x: 0, y: 0 };
      } else if (type === "table") {
        return { x: 0, y: position.y };
      } else {
        return position;
      }
    }

    setData((prevData) => {
      const newWidget = { widgetId: nanoid(), type: widgetType, position: { x: 20, y: 20 }, width: 250, height: 100 };
      return {
        ...prevData,
        containers: prevData.containers.map((container) => {
          if (
            position.x >= container.position.x &&
            position.x <= container.position.x + container.width &&
            position.y >= container.position.y &&
            position.y <= container.position.y + container.height
          ) {
            const relativePosition = getRelativePosition(position, container);
            const updatedPosition = getPosition(widgetType, relativePosition);
            const dimensions = getSize(widgetType, container);
            return {
              ...container,
              widgets: [...container.widgets, { ...newWidget, position: updatedPosition ?? { x: 20, y: 20 }, width: dimensions.width, height: dimensions.height }],
            };
          }
          return container;
        }),
      };
    });
  };

  const removeContainer = (containerId) => {
    const result = {
      ...data,
      containers: data.containers.filter((container) => container.containerId !== containerId),
    };
    setData(result);
  };

  const removeWidget = (widgetId, containerId) => {
    //
    const xxx = {
      ...data,
      containers: data.containers.map((container) =>
        container.containerId === containerId
          ? {
              ...container,
              widgets: container.widgets.filter((widget) => widget.widgetId !== widgetId),
            }
          : container
      ),
    };
    debugger;
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
            buttons: [],
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
            buttons: [],
          },
        ],
      });
    }
  };

  const addComponent = (widgetType, position, dimensions = { height: 32, width: 74 }) => {
    // debugger;
    if (!data) return;

    function getSize(type, container) {
      debugger;
      if (type === "tab" || type === "navBar") {
        return { width: container.width, height: container.height };
      } else {
        return { width: 100, height: 100 };
      }
    }
    function getPosition(type, position) {
      if (type === "tab" || type === "navBar") {
        return { x: 0, y: 0 };
      } else {
        return position;
      }
    }

    setData((prevData) => {
      const newComponent = {
        id: nanoid(),
        type: widgetType,
        position: { x: 20, y: 20 },
        width: dimensions.width,
        height: dimensions.height,
      };

      return {
        ...prevData,
        containers: prevData.containers.map((container) => {
          if (
            position.x >= container.position.x &&
            position.x <= container.position.x + container.width &&
            position.y >= container.position.y &&
            position.y <= container.position.y + container.height
          ) {
            const relativePosition = getRelativePosition(position, container);
            const updatedPosition = getPosition(widgetType, relativePosition);
            const dimensions = getSize(widgetType, container);
            return {
              ...container,
              [widgetType]: [...(container[widgetType] || []), { ...newComponent, position: updatedPosition ?? { x: 20, y: 20 }, width: dimensions.width, height: dimensions.height }], // Store in correct category
            };
          }
          return container;
        }),
      };
    });
  };

  const updateComponentPosition = (containerId, componentId, widgetType, newPosition) => {
    setData((prev) => ({
      ...prev,
      containers: prev.containers.map((container) => {
        if (container.containerId === containerId) {
          return {
            ...container,
            [widgetType]: container[widgetType]?.map((component) => {
              if (component.id === componentId) {
                const { width, height } = component;
                let newX = snapToGrid(newPosition.x);
                let newY = snapToGrid(newPosition.y);

                // ✅ Keep within container boundaries
                newX = Math.max(0, Math.min(container.width - width, newX));
                newY = Math.max(0, Math.min(container.height - height, newY));

                // ✅ Check for collision
                const isColliding = (x, y) => {
                  return container[widgetType]?.some((otherComponent) => {
                    if (otherComponent.id === componentId) return false;
                    return (
                      x < otherComponent.position.x + otherComponent.width &&
                      x + width > otherComponent.position.x &&
                      y < otherComponent.position.y + otherComponent.height &&
                      y + height > otherComponent.position.y
                    );
                  });
                };

                // ❌ If collision detected, find nearest available space
                if (isColliding(newX, newY)) {
                  console.log("Collision detected! Finding new position...");

                  let foundSpace = false;
                  let attemptX = newX,
                    attemptY = newY;
                  let step = snapToGrid(10);
                  let maxAttempts = (container.width * container.height) / (step * step);

                  for (let i = 0; i < maxAttempts && !foundSpace; i++) {
                    if (attemptX + width <= container.width && !isColliding(attemptX + step, attemptY)) {
                      attemptX += step;
                      foundSpace = true;
                    } else if (attemptY + height <= container.height && !isColliding(attemptX, attemptY + step)) {
                      attemptY += step;
                      foundSpace = true;
                    } else if (attemptX - step >= 0 && !isColliding(attemptX - step, attemptY)) {
                      attemptX -= step;
                      foundSpace = true;
                    } else if (attemptY - step >= 0 && !isColliding(attemptX, attemptY - step)) {
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
                    return component;
                  }
                }

                return {
                  ...component,
                  position: { x: newX, y: newY },
                };
              }
              return component;
            }),
          };
        }
        return container;
      }),
    }));
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
  const updateContainerSize = (containerId, newSize, _, position) => {
    debugger;
    setData((prevData) => {
      return {
        ...prevData,
        containers: prevData.containers.map((container) => {
          if (container.containerId === containerId) {
            const scaleX = newSize.width / container.width;
            const scaleY = newSize.height / container.height;

            const updatedWidgets = container.widgets.map((widget) => {
              return {
                ...widget,
                width: snapToGrid(Math.max(10, Math.floor(widget.width * scaleX))),
                height: snapToGrid(Math.max(10, Math.floor(widget.height * scaleY))),
                position: {
                  x: Math.floor(widget.position.x * scaleX),
                  y: Math.floor(widget.position.y * scaleY),
                },
              };
            });

            const updatedtextBoxes = container?.textBox?.map((textBox) => {
              return {
                ...textBox,
                width: snapToGrid(Math.max(10, Math.floor(textBox.width * scaleX))),
                height: snapToGrid(Math.max(10, Math.floor(textBox.height * scaleY))),
                position: {
                  x: Math.floor(textBox.position.x * scaleX),
                  y: Math.floor(textBox.position.y * scaleY),
                },
              };
            });

            const updatedButtons = container?.button?.map((button) => {
              return {
                ...button,
                width: snapToGrid(Math.max(10, Math.floor(button.width * scaleX))),
                height: snapToGrid(Math.max(10, Math.floor(button.height * scaleY))),
                position: {
                  x: Math.floor(button.position.x * scaleX),
                  y: Math.floor(button.position.y * scaleY),
                },
              };
            });

            return {
              ...container,
              width: snapToGrid(newSize.width),
              height: snapToGrid(newSize.height),
              position: { x: snapToGrid(position.x), y: snapToGrid(position.y) },
              widgets: updatedWidgets,
              button: updatedButtons ?? [],
              textBox: updatedtextBoxes ?? [],
            };
          }
          return container;
        }),
      };
    });
  };

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

  const updateComponentSize = (containerId, componentId, widgetType, newSize, newPosition) => {
    setData((prev) => ({
      ...prev,
      containers: prev.containers.map((container) => {
        if (container.containerId === containerId) {
          return {
            ...container,
            [widgetType]: container[widgetType]?.map((component) => {
              if (component.id === componentId) {
                let newWidth = snapToGrid(newSize.width);
                let newHeight = snapToGrid(newSize.height);
                let newX = snapToGrid(newPosition.x);
                let newY = snapToGrid(newPosition.y);

                // ✅ Ensure size stays within container
                newWidth = Math.max(20, Math.min(container.width - newX, newWidth));
                newHeight = Math.max(20, Math.min(container.height - newY, newHeight));

                // ✅ Ensure position stays within container
                newX = Math.max(0, Math.min(container.width - newWidth, newX));
                newY = Math.max(0, Math.min(container.height - newHeight, newY));

                // ✅ Collision check
                const isColliding = (x, y, w, h) => {
                  return container[widgetType]?.some((otherComponent) => {
                    if (otherComponent.id === componentId) return false; // Ignore self
                    return (
                      x < otherComponent.position.x + otherComponent.width &&
                      x + w > otherComponent.position.x &&
                      y < otherComponent.position.y + otherComponent.height &&
                      y + h > otherComponent.position.y
                    );
                  });
                };

                // ❌ If collision detected, find the nearest available space
                if (isColliding(newX, newY, newWidth, newHeight)) {
                  console.log("Collision detected! Finding a new position...");

                  let foundSpace = false;
                  let attemptX = newX,
                    attemptY = newY;
                  let step = snapToGrid(10);
                  let maxAttempts = (container.width * container.height) / (step * step);

                  for (let i = 0; i < maxAttempts && !foundSpace; i++) {
                    if (attemptX + newWidth <= container.width && !isColliding(attemptX + step, attemptY, newWidth, newHeight)) {
                      attemptX += step;
                      foundSpace = true;
                    } else if (attemptY + newHeight <= container.height && !isColliding(attemptX, attemptY + step, newWidth, newHeight)) {
                      attemptY += step;
                      foundSpace = true;
                    } else if (attemptX - step >= 0 && !isColliding(attemptX - step, attemptY, newWidth, newHeight)) {
                      attemptX -= step;
                      foundSpace = true;
                    } else if (attemptY - step >= 0 && !isColliding(attemptX, attemptY - step, newWidth, newHeight)) {
                      attemptY -= step;
                      foundSpace = true;
                    }
                  }

                  if (foundSpace) {
                    newX = attemptX;
                    newY = attemptY;
                    console.log("New position found at:", newX, newY);
                  } else {
                    console.log("No available space found, keeping original position and size.");
                    return component;
                  }
                }

                // ✅ Update component with new position & size
                return {
                  ...component,
                  position: { x: newX, y: newY },
                  width: newWidth,
                  height: newHeight,
                };
              }
              return component;
            }),
          };
        }
        return container;
      }),
    }));
  };

  const contextValue = useMemo(
    () => ({
      data,
      draggingWidget,
      startDragging,
      detectNewContainer,
      removeWidget,
      moveWidgetToContainer,
      updateContainerPosition,
      updateWidgetPosition,
      updateContainerSize,
      updateWidgetSize,
      snapToGrid,
      removeContainer,
      addWidget,
      updateComponentSize,
      addPanel,
      updateComponentPosition,
      addComponent,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, draggingWidget]
  );

  return <WidgetContext.Provider value={contextValue}>{children}</WidgetContext.Provider>;
};

export const useWidgetContext = () => useContext(WidgetContext);
