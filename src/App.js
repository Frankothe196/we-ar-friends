import React, {useEffect, useState} from "react";
import Scene from "./components/scene";
import UserInterface from "./components/userInterface";

function App() {

  const [step, setStep] = useState("")
  const [activeMap,setMap] = useState()
  const [gameMode,setGameMode] = useState()

  useEffect(()=>{
    setMap("Kenya International Convention Center")
    setStep("login")
  },[])
  
  return (
    <>
      <UserInterface step= {step} setStep= {setStep} activeMap= {activeMap} setMap= {setMap} gameMode= {gameMode} setGameMode= {setGameMode}/>
      <Scene/>
    </>
  );
}

export default App;
