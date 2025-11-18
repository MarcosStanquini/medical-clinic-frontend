const BASE_URL = "https://ifsp.ddns.net/webservices/clinicaMedica"

export async function getSpecialties(){
    try{
        const response = await fetch(`${BASE_URL}/especialidades`)
        if(!response.ok) throw new Error(`Response status: ${response.status}`)
        const result = await response.json()
        if(!Array.isArray(result)) throw new Error("Formato inesperado!")
        return result
    }catch(err){
        console.error(err)
        return []
    }
}
