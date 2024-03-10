import React, { useEffect, useState } from "react";
import styles from "../styles/interface.module.scss";

const UserInterface = () => {
  const [step, setStep] = useState("")
  const [activeMap,setMap] = useState()
  const [gameMode,setGameMode] = useState()

  useEffect(()=>{
    setMap("Kenya International Convention Center")
    setStep("login")
  }
  ,[])

  const changeStep = (e) =>{
    setStep(e)
  }

  if(step==="login"){
    return (
      <>
        {step=="login"?
        <div className={styles.container}>
          <h3>Enter a username</h3>
          <input type="text" placeholder="You Guy/My Guy"/>
          <div className={styles["buttons-container"]}>
            <button onClick={()=>{changeStep("opts")}} className={styles.button}>Get Started</button>
          </div>
        </div>
      
        :""}
      </>
    )
  }
  if(step==="opts"){
    return (
      <div className={styles.container}>
        <div className={styles["buttons-container"]}>
          <button onClick={()=>{setGameMode("fpv");setStep("playing")}} className={styles.button}>First Person</button>
          <button onClick={()=>{setGameMode("3pv");setStep("playing")}} className={styles.button}>Third Person</button>
        </div>
        <p className={styles["active-element"]}>{activeMap}</p>
        <select onChange={(e)=>{setMap(e.target.value)}} className={styles["select-box"]}>
          <option value="">{gameMode}</option>
          <option value="option1">White House</option>
          <option value="option2">State House</option>
          <option value="option3">Museum</option>
        </select>
      </div>
    );
  }

};

export default UserInterface