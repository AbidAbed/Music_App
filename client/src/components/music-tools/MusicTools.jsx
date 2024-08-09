import React, { useEffect } from 'react'
import { useAppContext } from '../../context/appContext'
import { ADD_COLUMN, ADD_NEW_BOX, CHANGE_MUSIC_TOOL, GET_ACTIVE_MUSIC_TOOL, REMOVE_BOX, REMOVE_COLUMN } from '../../context/actions'
import "./musictools.css"
import logoIcon from "../../assets/logo.svg"


const MusicTools = () => {

    const {dispatch , musicTools , changeMusicTool , addNewBox , removeBox , addColumn , removeColumn , undoStack , redoStack , addedSounds , actions , actionIndex} = useAppContext()
    
    // useEffect(() => {
    //     //////////console.log("music tools" , musicTools);
    //     ////////console.log("actions" , actions);
    //     ////////console.log("actionIndex" , actionIndex);
    // } , [musicTools , redoStack , undoStack , addedSounds , actions , actionIndex])

 
    const handleChangeSelectedTool = (musicTool) => {
        changeMusicTool(musicTool.id)
    }

    
    return (
        <>
        
    <div className='music-types-container'>

        <div className='music-tool-title-container'>
            <p key={Math.random()} className='music-tool-title'>الاّلات  <br />الموسيقية</p>
        </div>
        
        <ul className='music-types-column'>
            {musicTools?.map((musicTool) => (
                <>
                    <li key={musicTool.id}>
                        <button className='music-tool-btn' onClick={() => handleChangeSelectedTool(musicTool)}>
                            <img src={musicTool.isSelected ? musicTool.selectedIconImage : musicTool.iconImage} alt={musicTool.musicToolName} className='tool-icon' />
                        </button>
                    </li>
                </>               
            ))}
        </ul>
        
    </div>
        </>
  )
}


export default MusicTools