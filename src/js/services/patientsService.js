const BASE_URL = "https://ifsp.ddns.net/webservices/clinicaMedica";


async function createPatient(e){
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
        if(result.msg){
            showToast(String(result.msg), "error")
            throw new Error(result.msg)
        }
        showToast("Paciente criado com sucesso!", "success")
        e.target.reset()
        
    }catch(err){
        showToast(String(result.msg), "error")
    }
}


async function getData() {
  try {
    const response = await fetch(`${BASE_URL}/pacientes`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      for (const patient of data) {
        insertPatientList(patient.nome, patient.dataNascimento);
      }
    } catch (err) {
    throw new Error(err.message);
    }
}

getData();