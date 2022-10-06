import Axios from "axios"
import React, { useState, useRef } from "react"

function CreateNewForm(props) {
  const [city, setCity] = useState("")
  const [rooms, setRooms] = useState("")
  const [files, setFile] = useState([{
    data: []
}])
  const tempArr = [];
  const handleImageUpload = e => {
    [...e.target.files].forEach(file => {
        tempArr.push(
            file
        );
    });
    setFile(tempArr)
};
  

  async function submitHandler(e) {
    e.preventDefault()
    const data = new FormData()
    
    files.forEach(file => {
        data.append("photos", file);
    });
    
    data.append("city", city)
    data.append("rooms", rooms)
    setCity("")
    setRooms("")
    setFile("")
    
    const newPhoto = await Axios.post("/create-sublet", data, { headers: { "Content-Type": "multipart/form-data" } })
    props.setSublets(prev => prev.concat([newPhoto.data]))

  }

  return (
    <form className="p-3 bg-success bg-opacity-25 mb-5" onSubmit={submitHandler}>
      <div className="mb-2">
        <input onChange={handleImageUpload} name="file" type="file" className="form-control" multiple/>
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