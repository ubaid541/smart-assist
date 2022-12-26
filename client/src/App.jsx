import { useState } from 'react'
import reactLogo from './assets/react.svg'
import bot from "./assets/bot.svg"
import user from "./assets/user.svg"

import './App.css'

function App() {
  const chatContainer = document.querySelector("#chat_container")
  const txtarea = document.querySelector("#txtarea")

  const [input_txt, setinput_txt] = useState('')


  let loadInterval;

// load messages
function loader(element){
  element.textContent = '';

  loadInterval = setInterval(()=>{
    element.textContent += ".";

    if(element.textContent === "...."){
      element.textContent = '';
    }
  },300)
}

// display text word by word 
function typeText(element,text){
  let index = 0;

  let interval = setInterval(()=>{
    if(index < text.length){
      element.innerHTML += text.charAt(index)
      index++;
    }else{
      clearInterval(interval)
    }
  },20)
}

// unique id for every single message
function generateUniqueId(){
  const timestamp = Date.now()
  const randomNumber = Math.random()
  const hexadecimalString = randomNumber.toString(16)

  return `id-${timestamp}-${hexadecimalString}`
}

function chatStripe (isAI,value,uniqueId){
  return (
    `
    <div class="wrapper ${isAI && 'ai'} ">
      <div class="chat">
        <div class="profile">
          <img
            src=${isAI ? bot : user}
            alt=${isAI ? 'bot' : 'user'}
          />
        </div>
        <div class="message" id=${uniqueId}>
          ${value}
        </div>
      </div>
    </div>
    `
  )
}


  const handleChange = (e)=>{
    setinput_txt((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()

    if(txtarea.value === " "){
      alert("Kindly enter something.")
      return;
    }
    
    chatContainer.innerHTML += chatStripe(false,input_txt.txtarea)

     // bot's chatstripe
  const uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    try {
      
  const response = await fetch('http://localhost:9000/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        prompt: input_txt.txtarea
    })
})

      clearInterval(loadInterval)
      messageDiv.innerHTML = " "

      const data = await response.json();

      const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

      typeText(messageDiv, parsedData)

    } catch (error) {
      clearInterval(loadInterval)
      messageDiv.innerHTML = " "
      messageDiv.innerHTML = "Something went wrong"
      alert(error)
      console.log(error);
    }


  }

  return (
 <>
      <div id="chat_container"></div>
      <form>
        <textarea
          id="txtarea"
          name="txtarea"
          rows="1"
          cols="1"
          onChange={handleChange}
          placeholder="Ask Something.."
        ></textarea>
        <button type="submit" onClick={handleSubmit}><img src="assets/send.svg" /></button>
      </form>
   </>
  )
}

export default App
