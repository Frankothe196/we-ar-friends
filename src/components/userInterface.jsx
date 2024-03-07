import React, { useEffect, useState } from "react";
import styles from "../styles/interface.module.scss";

const UserInterface = () => {
  const [step, setStep] = useState()
  const [activeMap,setMap] = useState()
  useEffect(()=>{
    setMap("Kenya International Convention Center")
    setStep("login")
  }
  ,[])

  if(step=="login"){
    return (
      <div className={styles.containerOpt}>
        <p>Enter a username</p>
        <input type="text" />
        <div className={styles["buttons-container"]}>
          <button onClick={()=>(setStep("opts"))} className={styles.button}>Get Started</button>
        </div>
      </div>
    );
  }
  if(step=="opts"){
    return (
      <div className={styles.containerOpt}>
        <div className={styles["buttons-container"]}>
          <button className={styles.button}>First Person</button>
          <button className={styles.button}>Third Person</button>
        </div>
        <div className={styles["active-element"]}>{activeMap}</div>
        <select onChange={(e)=>{setMap(e.target.value)}} className={styles["select-box"]}>
          <option value="option1">Whitehouse</option>
          <option value="option2">State House</option>
          <option value="option3">Museum</option>
        </select>
      </div>
    );
  }

};

export default UserInterface