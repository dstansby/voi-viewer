import { useRef, useEffect } from "react";

import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import "@kitware/vtk.js/Rendering/Profiles/Volume";

import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";

import vtkVolume from "@kitware/vtk.js/Rendering/Core/Volume";
import vtkVolumeMapper from "@kitware/vtk.js/Rendering/Core/VolumeMapper";
import "@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper";
import { makeLinearFunc } from "./functions";
import vtkXMLImageDataReader from "@kitware/vtk.js/IO/XML/XMLImageDataReader";

import heart from "./volumeData/heart.vti?url";
import { makeCylinder } from "./cylinder";
import vtkColorMaps from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps";

function App() {
  const vtkContainerRef = useRef(null);
  const context = useRef(null);

  useEffect(() => {
    if (!context.current) {
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //rootContainer: vtkContainerRef.current, // @ts-ignore
      });

      // Get renderer
      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      // Set up cylinder
      renderer.addActor(
        makeCylinder(
          112.65835429153337,
          31.132905384374858,
          [111.76032930789083, 65.10027418222336, 117.37352368519767]
        )
      );
      renderer.addActor(
        makeCylinder(
          93.94979246465604,
          31.133017433977397,
          [83.74153522064732, 92.56154847961753, 152.36084871496968]
        )
      );
      renderer.addActor(
        makeCylinder(
          65.60823284192719,
          30.280113261143107,
          [122.87015452410793, 68.3415010723188, 91.09181384490981]
        )
      );
      renderer.addActor(
        makeCylinder(
          56.53156327835792,
          31.132855192264735,
          [65.79158089773392, 62.136103679053676, 133.43551256549014]
        )
      );
      renderer.addActor(
        makeCylinder(
          74.30121106188274,
          30.27996240053903,
          [74.7402613697195, 70.35539485748886, 95.63860216092766]
        )
      );
      renderer.addActor(
        makeCylinder(
          74.29359904698025,
          30.2800898089079,
          [67.06318210038442, 117.35535733754338, 131.79428493370017]
        )
      );

      // Set up volume
      const volActor = vtkVolume.newInstance();
      const volMapper = vtkVolumeMapper.newInstance();
      volActor.setMapper(volMapper);
      // Set rendering properties
      const opacity = makeLinearFunc();
      volActor.getProperty().setScalarOpacity(0, opacity);
      volActor.getProperty().setInterpolationTypeToLinear();
      volActor.getProperty().setGradientOpacityMinimumValue(0, 0);
      volActor.getProperty().setGradientOpacityMaximumValue(0, 256 * 0.05);
      volActor.getProperty().setShade(false);
      volActor.getProperty().setUseGradientOpacity(0, true);

      const dataRange = 256;
      const gradOpac = 0.9;
      const minV = (gradOpac - 0.5) / 0.7;
      volActor
        .getProperty()
        .setGradientOpacityMinimumValue(0, dataRange * 0.4 * minV * minV);
      volActor
        .getProperty()
        .setGradientOpacityMaximumValue(0, dataRange * gradOpac * gradOpac);
      volActor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
      volActor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
      volActor.getProperty().setAmbient(0.2);
      volActor.getProperty().setDiffuse(0.7);
      volActor.getProperty().setSpecular(0.3);
      volActor.getProperty().setSpecularPower(8.0);
      const preset = vtkColorMaps.getPresetByName("Grayscale");
      const lookupTable = volActor.getProperty().getRGBTransferFunction(0);
      lookupTable.applyColorMap(preset);

      const reader = vtkXMLImageDataReader.newInstance();
      volMapper.setInputConnection(reader.getOutputPort());

      reader
        .setUrl(heart)
        .then(() => reader.loadData())
        .then(() => {
          // --- Add volume actor to scene ---
          renderer.addVolume(volActor);

          // --- Reset camera and render the scene ---
          renderer.resetCamera();
          renderWindow.render();
        });

      renderer.resetCamera();
      renderWindow.render();

      //context.current = {
      //  fullScreenRenderer,
      //  renderWindow,
      //  reader,
      //  volMapper,
      //  volActor,
      //};
    }
  }, [vtkContainerRef]);

  return (
    <div>
      <div ref={vtkContainerRef} />
    </div>
  );
}

export default App;
