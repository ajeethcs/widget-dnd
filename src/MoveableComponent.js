import React, { useRef, useEffect } from "react";
import Moveable from "react-moveable";
import Ruler from "@scena/react-ruler";

const MoveableComponent = () => {
    const targetRef = useRef(null);
    const moveableRef = useRef(null);
    
    // Initial dimensions
    const frame = useRef({
        width: 200,
        height: 150,
        x: 100,
        y: 100
    });

    useEffect(() => {
        if (moveableRef.current) {
            moveableRef.current.updateRect();
        }
    }, []);

    return (
        <div style={{ position: "relative", width: "100vw", height: "100vh", background: "#f0f0f0" }}>
            {/* Top Ruler */}
            <Ruler
                type="horizontal"
                style={{ position: "absolute", top: 0, left: 50, width: "calc(100% - 50px)", height: 20 }}
                zoom={1}
                unit={50}
            />

            {/* Left Ruler */}
            <Ruler
                type="vertical"
                style={{ position: "absolute", top: 20, left: 0, width: 50, height: "calc(100% - 20px)" }}
                zoom={1}
                unit={50}
            />

            {/* Moveable Target */}
            <div
                ref={targetRef}
                style={{
                    position: "absolute",
                    width: `${frame.current.width}px`,
                    height: `${frame.current.height}px`,
                    background: "lightblue",
                    transform: `translate(${frame.current.x}px, ${frame.current.y}px)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #007bff",
                    userSelect: "none"
                }}
            >
                Drag & Resize Me
            </div>

            {/* Moveable Instance */}
            <Moveable
                ref={moveableRef}
                target={targetRef}
                draggable={true}
                resizable={true}
                throttleResize={0}  // Removes delay in resizing
                keepRatio={false}
                renderDirections={["n", "s", "e", "w", "ne", "nw", "se", "sw"]}
                onDrag={({ left, top }) => {
                    requestAnimationFrame(() => {
                        frame.current.x = left;
                        frame.current.y = top;
                        targetRef.current.style.transform = `translate(${left}px, ${top}px)`;
                    });
                }}
                onResize={({ width, height }) => {
                    requestAnimationFrame(() => {
                        frame.current.width = width;
                        frame.current.height = height;
                        targetRef.current.style.width = `${width}px`;
                        targetRef.current.style.height = `${height}px`;
                    });
                }}
            />
        </div>
    );
};

export default MoveableComponent;
