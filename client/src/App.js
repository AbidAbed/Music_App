import { useState } from "react";
import "./App.css";
import Canvas from "./components/canvas/Canvas";
import MusicControls from "./components/music-controls/MusicControls";
import MusicTools from "./components/music-tools/MusicTools";
import { AppProvider, AppContext, AppConsumer } from "@pixi/react";
import PopUpModal from "./components/popup-modal/PopUpModal";
import { ToastContainer } from 'react-toastify';
import logoIcon from "./assets/logo-frame.svg"


// import { Application } from "pixi.js"

function App() {
  // const AppRenderTest = new Application()
  // //////////////console.log(AppRenderTest.stage);
  // render(
  //   <AppProvider value={AppRenderTest}>
  //     <Canvas/>
  //   </AppProvider>,
  // );

  const [openModal ,  setOpenModal] = useState(false)



  return (
    <div className="App">
      
      <div className='logo-container'>
              <img className='logo-icon' src={logoIcon} alt="" />
              {/* <img className='logo-icon' src={logoFrame} alt="" /> */}
            </div>
            
      <div className="row">
        
        <div className="music-controls-container">
          <MusicControls openModal={openModal} setOpenModal={setOpenModal} />
        </div>

        <div>

          <div className="canvas-header-container">

            <div className="canvas-header-items">

              <div className="canvas-title-text-container">
                <h2 className="canvas-title-text">استعد لاكتشاف العازف الموهوب الذي ينام في داخلك!</h2>
                <p className="canvas-title-sub-text">انطلق في رحلة إبداعية لتكوين أجمل الألحان وتعيش تجربة فريدة من نوعها في عالم الموسيقى الخاص بك!</p>
              </div>

            </div>

 

          </div>

          <Canvas />

        </div>
        
        <div className="music-tools-container">
          <MusicTools />
        </div>

      </div>
    
      {openModal && <PopUpModal openModal={openModal} setOpenModal={setOpenModal} /> }

      <ToastContainer/>
      
    </div>
  );
}


export default App;
