import { insertMedicList, closeModal, reloadMedicList } from "../pages/medic.js"
import { showToast } from "../utils/toast.js"

const BASE_URL = "https://ifsp.ddns.net/webservices/clinicaMedica"

export async function createMedic(e){
    e.preventDefault()
    const form = e.target
    const name = form.querySelector('input[name="nome"]').value
    const specialtyId = Number(form.querySelector('select[name="especialidade"]').value)

    const body = { nome: name, idEspecialidade: specialtyId }

    try{
        const response = await fetch(`${BASE_URL}/medicos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })

        const result = await response.json()

        if(!response.ok){
            throw new Error(String(result.msg))
        }

        insertMedicList(result.nome || name, result.idEspecialidade || specialtyId, result.id)
        showToast("Médico criado com sucesso!", "success")
        form.reset()
    }catch(err){
        if(!err.message) err.message = "Algo inesperado aconteceu!"
        showToast(err.message, "error")
    }
}

export async function getMedics(){
    try{
        const response = await fetch(`${BASE_URL}/medicos`)
        if(!response.ok) throw new Error(`Response status: ${response.status}`)
        const result = await response.json()
        if(!Array.isArray(result)) throw new Error("Formato inesperado!")
        return result
    }catch(err){
        console.error(err)
        return []
    }
}

export async function deleteMedic(button){
    const medicId = button.getAttribute('medic-id')
    try{
        const response = await fetch(`${BASE_URL}/medicos/${medicId}`, { method: "DELETE" })
        const result = await response.json()
        if(!response.ok) throw new Error(String(result.msg))
        showToast("Médico deletado com sucesso!", "success")
        return true
    }catch(err){
        if(!err.message) err.message = "Algo inesperado aconteceu ao deletar!"
        showToast(err.message, "error")
        return false
    }
}

export async function updateMedic(e){
    e.preventDefault()
    const form = e.target
    const name = form.querySelector('input[name="nome"]').value
    const specialtyId = Number(form.querySelector('select[name="especialidade"]').value)
    const medicId = form.getAttribute('medic-id')

    const body = { nome: name, idEspecialidade: specialtyId }

    try{
        const response = await fetch(`${BASE_URL}/medicos/${medicId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
        const result = await response.json()
        if(!response.ok) throw new Error(String(result.msg))

        closeModal()
        showToast("Médico editado com sucesso!", "success")
        await reloadMedicList()
    }catch(err){
        if(!err.message) err.message = "Algo inesperado aconteceu ao editar!"
        showToast(err.message, "error")
    }
}
