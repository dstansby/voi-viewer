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
        background: [0, 0, 0],
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
      const reader = vtkXMLImageDataReader.newInstance();
      volMapper.setInputConnection(reader.getOutputPort());

      volMapper.setBlendModeToComposite();
      volActor.setMapper(volMapper);
      const volProp = volActor.getProperty();
      // Set rendering properties
      volProp.setUseGradientOpacity(0, true);
      volProp.setGradientOpacityMinimumValue(0, 32);
      volProp.setGradientOpacityMaximumValue(0, 64.0);
      volProp.setGradientOpacityMinimumOpacity(0, 0.0);
      volProp.setGradientOpacityMaximumOpacity(0, 1.0);
      volProp.setShade(true);
      volProp.setAmbient(0.2);
      volProp.setDiffuse(0.7);
      volProp.setSpecular(0.3);
      volProp.setSpecularPower(8.0);

      const opacity = makeLinearFunc();
      volProp.setScalarOpacity(0, opacity);
      volProp.setInterpolationTypeToFastLinear();

      const preset = vtkColorMaps.getPresetByName("Grayscale");
      const lookupTable = volActor.getProperty().getRGBTransferFunction(0);
      lookupTable.applyColorMap(preset);

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
