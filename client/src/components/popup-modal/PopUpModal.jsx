import React from "react";
import "./PopupModal.css";
import { useAppContext } from "../../context/appContext";
import { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../loding-spinner/LoadingSpinner";

const PopUpModal = ({ openModal, setOpenModal }) => {
  const { clearAddedSounds, musicTools, cellWidth, bpm, bpmFactor } =
    useAppContext();

  const [addedSounds, setAddedSounds] = useState([]);

  const [showError, setShowError] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [loading, setLoading] = useState(false);

  const [fileName, setFileName] = useState("");

  function calculateTimeNeededForXPixels(x, timeForOnePixle) {
    return x * timeForOnePixle;
  }

  // function calculateTimePerPxForOneSecond(musicScore) {
  //     return cellWidth * musicScore * bpm / 60
  // }

  function timeNeededForOnePixel(musicScore) {
    //(4 / (0.714285714 * 1000)); => 0.0056
    // 0.00731428571 => works for backend 120 bpm
    return 0.00731428571 / bpmFactor;
  }

  const downloadAddedMusic = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://novel-era.co/music/combine-sounds",
        {
          addedSounds,
          userFileName: fileName,
        },
        {
          responseType: "blob",
        }
      );

      const blobUrl = URL.createObjectURL(response?.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${fileName}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);

      setOpenModal(false);
    } catch (error) {
      setShowError(true);
      setErrorMsg(error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const time = setTimeout(() => {
      setShowError(false);
      setErrorMsg("");
    }, 3000);

    return () => {
      clearTimeout(time);
    };
  }, [errorMsg, showError]);

  useEffect(() => {
    const sounds = [];
    for (let i = 0; i < musicTools.length; i++) {
      const timeForPx = timeNeededForOnePixel(musicTools[i].musicScore);

      for (let j = 0; j < musicTools[i].elements.length; j++) {
        const startingTime = calculateTimeNeededForXPixels(
          musicTools[i].elements[j].x,
          timeForPx
        );

        const endingTime =
          calculateTimeNeededForXPixels(
            musicTools[i].elements[j].width,
            timeForPx
          ) + startingTime;

        const duration = endingTime - startingTime;

        sounds.push({
          startingTime,
          endingTime,
          duration,
          path: `${musicTools[i].musicToolName}/${
            musicTools[i].elements[j].rowIndex + 1
          }.mp3`,
        });
      }
    }

    setAddedSounds([...sounds]);
  }, [musicTools]);

  return (
    <div className="modal">
      <div className="modal-content">
        {!loading && (
          <>
            <div className="modal-header">
              <h2>أعطِ لألحانك اسما يليق بها!</h2>
            </div>

            <div className="modal-input">
              <div className="action-btns">
                <button onClick={() => setOpenModal(false)}>إلغاء</button>
                <button onClick={downloadAddedMusic}>حفظ</button>
              </div>

              <input
                placeholder="إسم الموسيقى الخاصة بك"
                onChange={(e) => setFileName(e.target.value)}
                type="text"
              />
            </div>
          </>
        )}

        {loading && <LoadingSpinner />}

        {showError && !loading && errorMsg !== "" && (
          <div className="error-message">
            <p>حدث خطأ أثناء عملية الحفظ.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopUpModal;
