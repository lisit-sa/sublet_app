import Axios from "axios"
import React, { useState, useRef } from "react"

function CreateNewForm(props) {
  const [city, setCity] = useState("")
  const [rooms, setRooms] = useState("")
  const [file, setFile] = useState("")
  const CreatePhotoField = useRef()

  async function submitHandler(e) {
    e.preventDefault()
    const data = new FormData()
    data.append("photo", file)
    data.append("city", city)
    data.append("rooms", rooms)
    setCity("")
    setRooms("")
    setFile("")
    CreatePhotoField.current.value = ""
    const newPhoto = await Axios.post("/create-sublet", data, { headers: { "Content-Type": "multipart/form-data" } })
    props.setSublets(prev => prev.concat([newPhoto.data]))
  }

  return (
    <form className="p-3 bg-success bg-opacity-25 mb-5" onSubmit={submitHandler}>
      <div className="mb-2">
        <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
      </div>
      <div className="mb-2">
        <input onChange={e => setCity(e.target.value)} value={city} type="text" className="form-control" placeholder="City" />
      </div>
      <div className="mb-2">
        <input onChange={e => setRooms(e.target.value)} value={rooms} type="text" className="form-control" placeholder="Number of rooms" />
      </div>

      <button className="btn btn-success">Add new sublet</button>
    </form>
  )
}

export default CreateNewForm