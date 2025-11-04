

function patientData(){
    const form = document.querySelector("form")

    let name = form.querySelector('input[name="nome"]').value
    let dateOfBirth = form.querySelector('input[name="data-nascimento"]').value

    return {
        nome: name,
        dataNascimento: dateOfBirth
    }
}


function insertPatientList(name, dateOfBirth){
    const container = document.querySelector(".lista-pacientes");

    const ul = document.createElement("ul");
    const liName = document.createElement("li");
    const liDate = document.createElement("li");

    liName.innerText = name;
    liDate.innerText = dateOfBirth;

    ul.append(liName, liDate);

    container.appendChild(ul);
}
const form = document.querySelector('form');
form.addEventListener('submit', createPatient);


