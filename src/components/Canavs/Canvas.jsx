import GridBackground from "./GridBackground";
import Container from "./Container";
import Widget from "./Widget";

const Canvas = () => {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <GridBackground />
      <Container id="container-1" x={50} y={50}>
        <Widget id="widget-1" />
      </Container>
    </div>
  );
};

export default Canvas;
