import { patientData,  insertPatientList } from "../pages/patient.js";
import { showToast} from "../utils/toast.js";

const BASE_URL = "https://ifsp.ddns.net/webservices/clinicaMedica";

export async function createPatient(e){
    e.preventDefault() 
    let body = patientData()
    
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
    const response = await fetch(`${BASE_URL}/pacientes`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();

      if(!Array.isArray(result)){
        throw new Error("Formato inesperado!")
      }

      for (const patient of result) {
        insertPatientList(patient.nome, patient.dataNascimento, patient.id);
      }
    } catch (err) {
      console.error(err)
    }
} 


export async function deletePatient(e){
    const patientId = e.getAttribute('patient-id');
    try{
        let response = await fetch(`${BASE_URL}/pacientes/${patientId}`, {
            method: "DELETE", 
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(String(result.msg))
        }

        showToast("Paciente deletado com sucesso!", "success");
        return true

    }catch(err){
        if(!err.message){
          err.message = "Algo inesperado aconteceu ao deletar!"
        }
        showToast(err.message, "error")
        return false
    }
}

getData();