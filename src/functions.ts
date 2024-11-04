import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";

function makeLinearFunc() {
  const start = 100;
  const end = 255;
  const height = 0.5;

  const range = end - start;
  const nsamples = 32;

  const func = vtkPiecewiseFunction.newInstance();
  // Start and end points
  func.addPoint(start, 0.0);
  func.addPoint(end, height);

  for (let i = 0; i <= nsamples; i++) {
    const xCoord = start + i * (range / nsamples);
    const yCoord = (i * height) / nsamples;
    func.addPoint(xCoord, yCoord);
  }
  return func;
}

export { makeLinearFunc };
