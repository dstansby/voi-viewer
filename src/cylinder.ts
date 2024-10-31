import vtkCylinderSource from "@kitware/vtk.js/Filters/Sources/CylinderSource";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";

function makeCylinder(
  height: number,
  radius: number,
  center: [number, number, number]
) {
  const cyclinderSource = vtkCylinderSource.newInstance({
    height: height,
    radius: radius,
    center: center,
    direction: [0, 0, 1],
    resolution: 20,
  });
  const mapper = vtkMapper.newInstance();
  mapper.setInputConnection(cyclinderSource.getOutputPort());
  const actor = vtkActor.newInstance();
  actor.setMapper(mapper);

  actor.getProperty().setOpacity(0.8);
  actor.getProperty().setColor(236 / 255, 80 / 255, 85 / 255);

  return actor;
}

export { makeCylinder };
