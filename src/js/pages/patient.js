function patientData(){
    const form = document.querySelector("form")

    let name = form.querySelector('input[name="name"]').value
    let dateOfBirth = form.querySelector('input[name="data-nascimento"]').value

    return {
        nome: name,
        dataNascimento: dateOfBirth
    }
}

const form = document.querySelector('form');
form.addEventListener('submit', createPatient);
