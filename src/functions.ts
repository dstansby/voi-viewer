import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";

function makeLinearFunc() {
  const start = 0.4;
  const end = 1;
  const height = 0.6;

  const range = end - start;
  const nsamples = 16;

  const func = vtkPiecewiseFunction.newInstance();
  // Start and end points
  func.addPoint(0, 0.0);
  func.addPoint(1, height);

  for (let i = 0; i <= nsamples; i++) {
    const xCoord = start + i * (range / nsamples);
    const yCoord = (i * height) / nsamples;
    func.addPoint(xCoord, yCoord);
  }
  return func;
}

export { makeLinearFunc };
