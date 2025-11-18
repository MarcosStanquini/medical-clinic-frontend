import { showToast } from "../utils/toast.js"

const BASE_URL = "https://ifsp.ddns.net/webservices/clinicaMedica"

export async function getConsultations(){
    try{
        const response = await fetch(`${BASE_URL}/consultas`)
        if(!response.ok) throw new Error(`Response status: ${response.status}`)
        const result = await response.json()
        if(!Array.isArray(result)) throw new Error("Formato inesperado!")
        return result
    }catch(err){
        console.error(err)
        return []
    }
}

export async function createConsultation(e){
    e.preventDefault()
    const form = e.target
    const patientId = Number(form.querySelector('select[name="paciente"]').value)
    const medicId = Number(form.querySelector('select[name="medico"]').value)
    const date = form.querySelector('input[name="data"]').value
    const time = form.querySelector('input[name="hora"]').value

    const dateTime = `${date} ${time}:00`

    const body = { idPaciente: patientId, idMedico: medicId, data: dateTime }

    try{
        const response = await fetch(`${BASE_URL}/consultas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
        const result = await response.json()
        if(!response.ok) throw new Error(String(result.msg))
        showToast("Consulta criada com sucesso!", "success")
        form.reset()
        return result
    }catch(err){
        if(!err.message) err.message = "Algo inesperado aconteceu ao criar consulta!"
        showToast(err.message, "error")
        return null
    }
}

export async function deleteConsultation(button){
    const consultationId = button.getAttribute('consulta-id')
    try{
        const response = await fetch(`${BASE_URL}/consultas/${consultationId}`, { method: "DELETE" })
        const result = await response.json()
        if(!response.ok) throw new Error(String(result.msg))
        showToast("Consulta deletada com sucesso!", "success")
        return true
    }catch(err){
        if(!err.message) err.message = "Algo inesperado aconteceu ao deletar consulta!"
        showToast(err.message, "error")
        return false
    }
}
