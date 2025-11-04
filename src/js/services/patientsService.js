async function createPatient(e){
    e.preventDefault()

    let body = patientData()
    try{
        let response = await fetch("https://ifsp.ddns.net/webservices/clinicaMedica/pacientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        const result = await response.json()
        if(result.msg){
            throw new Error(result.msg)
        }
        console.log(result)
        alert("Paciente cadastrado com sucesso!");
        e.target.reset()
        
    }catch(err){
        alert(`Erro ao cadastrar paciente: ${err.message}`);
    }
}


async function getData() {
  const url = "https://ifsp.ddns.net/webservices/clinicaMedica/pacientes";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    const data = await response.json();
    for (const patient of data) {
      insertPatientList(patient.nome, patient.dataNascimento);
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
}

getData();