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

