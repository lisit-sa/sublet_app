import Axios from "axios"
import React, { useState } from "react"

function SubletCard(props) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftCity, setDraftCity] = useState("")
  const [file, setFile] = useState()
  const [draftRooms, setDraftRooms] = useState("")

  async function submitHandler(e) {
    e.preventDefault()
    setIsEditing(false)
    props.setSublets(prev =>
      prev.map(function (sublet) {
        if (sublet._id == props.id) {
          return { ...sublet, city: draftCity, rooms: draftRooms }
        }
        return sublet
      })
    )
    const data = new FormData()
    if (file) {
      data.append("photo", file)
    }
    data.append("_id", props.id)
    data.append("city", draftCity)
    data.append("rooms", draftRooms)
    const newPhoto = await Axios.post("/update-sublet", data, { headers: { "Content-Type": "multipart/form-data" } })
    if (newPhoto.data) {
      props.setSublets(prev => {
        return prev.map(function (sublet) {
          if (sublet._id == props.id) {
            return { ...sublet, photo: newPhoto.data }
          }
          return sublet
        })
      })
    }
  }

  return (
    <div className="card">
      <div className="our-card-top">
        {isEditing && (
          <div className="our-custom-input">
            <div className="our-custom-input-interior">
              <input onChange={e => setFile(e.target.files[0])} className="form-control form-control-sm" type="file" />
            </div>
          </div>
        )}
        <img src={props.photo ? `/uploaded-photos/${props.photo}` : "img/fallback.png"} className="card-img-top" alt={`${props.rooms} named ${props.city}`} />
      </div>
      <div className="card-body">
        {!isEditing && (
          <>
            <h4>{props.city}</h4>
            <p className="text-muted small">{props.rooms}</p>
            {!props.readOnly && (
              <>
                <button
                  onClick={() => {
                    setIsEditing(true)
                    setDraftCity(props.city)
                    setDraftRooms(props.rooms)
                    setFile("")
                  }}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </button>{" "}
                <button
                  onClick={async () => {
                    const test = Axios.delete(`/sublet/${props.id}`)
                    props.setSublets(prev => {
                      return prev.filter(sublet => {
                        return sublet._id != props.id
                      })
                    })
                  }}
                  className="btn btn-sm btn-outline-danger"
                >
                  Delete
                </button>
              </>
            )}
          </>
        )}
        {isEditing && (
          <form onSubmit={submitHandler}>
            <div className="mb-1">
              <input autoFocus onChange={e => setDraftCity(e.target.value)} type="text" className="form-control form-control-sm" value={draftCity} />
            </div>
            <div className="mb-2">
              <input onChange={e => setDraftRooms(e.target.value)} type="text" className="form-control form-control-sm" value={draftRooms} />
            </div>
            <button className="btn btn-sm btn-success">Save</button>{" "}
            <button onClick={() => setIsEditing(false)} className="btn btn-sm btn-outline-secondary">
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default SubletCard