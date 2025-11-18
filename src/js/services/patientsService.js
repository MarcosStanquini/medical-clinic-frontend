import { patientData,  insertPatientList, closeModal, reloadPatientList} from "../pages/patient.js"
import { showToast } from "../utils/toast.js"

const BASE_URL = "https://ifsp.ddns.net/webservices/clinicaMedica"

export async function createPatient(e){
    e.preventDefault() 
    let body = patientData(e.target)
    
    try{
        let response = await fetch(`${BASE_URL}/pacientes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        const result = await response.json()

        if(!response.ok){
          throw new Error(String(result.msg))
        }

        insertPatientList(body.nome, body.dataNascimento, result.id)
        showToast("Paciente criado com sucesso!", "success")
        e.target.reset()
        
    }catch(err){
        if(!err.message){
          err.message = "Algo inesperado aconteceu!"
        }
        showToast(err.message, "error")
    }
}


export async function getData() {
  try {
    const response = await fetch(`${BASE_URL}/pacientes`)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
      const result = await response.json()

      if(!Array.isArray(result)){
        throw new Error("Formato inesperado!")
      }

      for (const patient of result) {
        insertPatientList(patient.nome, patient.dataNascimento, patient.id)
      }
    } catch (err) {
      console.error(err)
    }
}

export async function getPatients(){
  try {
    const response = await fetch(`${BASE_URL}/pacientes`)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const result = await response.json()
    if(!Array.isArray(result)){
      throw new Error("Formato inesperado!")
    }
    return result
  } catch (err) {
    console.error(err)
    return []
  }
} 


export async function deletePatient(button){
    const patientId = button.getAttribute('patient-id')
    try{
        let response = await fetch(`${BASE_URL}/pacientes/${patientId}`, {
            method: "DELETE", 
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(String(result.msg))
        }

        showToast("Paciente deletado com sucesso!", "success")
        return true

    }catch(err){
        if(!err.message){
          err.message = "Algo inesperado aconteceu ao deletar!"
        }
        showToast(err.message, "error")
        return false
    }
}

export async function updatePatient(e) {
  e.preventDefault()
  
  const body = patientData(e.target)
  const patientId = e.target.getAttribute('patient-id')

  try {
    let response = await fetch(`${BASE_URL}/pacientes/${patientId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const result = await response.json()

    if(!response.ok){
      throw new Error(String(result.msg))
    }

    closeModal()
    showToast("Paciente editado com sucesso!", "success")
    await reloadPatientList()

  } catch (err) {
    if(!err.message){
      err.message = "Algo inesperado aconteceu ao editar!"
    }
    showToast(err.message, "error")
  }
}


getData()