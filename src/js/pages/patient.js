import {ButtonClass} from "./enums/targetButtonEnum.js"
import { createPatient, deletePatient, updatePatient } from "../services/patientsService.js"

export function patientData(form){
    let name = form.querySelector('input[name="nome"]').value
    let dateOfBirth = form.querySelector('input[name="data-nascimento"]').value

    return {
        nome: name,
        dataNascimento: dateOfBirth
    }
}

function openModal(){
  const modal = document.querySelector("#modalPaciente")
  const modalContent = document.querySelector("#modalContent")
  
  modal.classList.remove("hidden")
  modal.classList.add("flex")
  

  setTimeout(() => {
    modalContent.classList.remove("scale-95", "opacity-0")
    modalContent.classList.add("scale-100", "opacity-100")
  }, 10)
}

export function closeModal(){
  const modal = document.querySelector("#modalPaciente")
  const modalContent = document.querySelector("#modalContent")
  

  modalContent.classList.remove("scale-100", "opacity-100")
  modalContent.classList.add("scale-95", "opacity-0")
  
  setTimeout(() => {
    modal.classList.add("hidden")
    modal.classList.remove("flex")
  }, 300)
}



function editPatient(bttn){
  const form = document.querySelector("#formEdicao")

  let actualName = bttn.getAttribute('patient-name')
  let actualDateBirth = bttn.getAttribute('patient-dateBirth')
  let patientId = bttn.getAttribute('patient-id')

  form.querySelector('input[name="nome"]').value = actualName
  form.querySelector('input[name="data-nascimento"]').value = actualDateBirth

  form.setAttribute("patient-id", patientId)
  
  openModal()
  
}

export function insertPatientList(name, dateOfBirth, id) {
  const container = document.querySelector("#lista-pacientes")

  const div = document.createElement("div");
  div.className = "flex justify-between items-center bg-white border rounded-lg p-4 shadow-sm mb-2";

  div.innerHTML = `
    <div>
      <p class="font-semibold text-gray-800">${name}</p>
      <p class="text-sm text-gray-500">Nascimento: ${dateOfBirth}</p>
    </div>
    <div class="flex gap-2">
      <button patient-id = "${id}" class="p-2 bg-gray-100 rounded hover:bg-gray-200">
        👁️
      </button>
      <button patient-id="${id}" patient-name="${name}" patient-dateBirth="${dateOfBirth}" class="p-2 bg-gray-100 rounded hover:bg-gray-200 edit-patient">
        ✏️
      </button>
      <button patient-id ="${id}" class="p-2 bg-red-600 text-white rounded hover:bg-red-500 delete-patient">
        🗑️
      </button>
    </div>
  `;

  container.append(div);
}

function removePatientDiv(bttn){
  let div = bttn.parentElement.parentElement
  if(div){
    div.remove()
  }
}

function setupPatientActions(){
  const container = document.querySelector("#lista-pacientes")

  container.addEventListener("click", async function(event){
    const button = event.target.closest('button')

    if(!button){
      return
    }

    if(button.classList.contains(ButtonClass.DELETE)){
      const isDeleted = await deletePatient(button)
      if(isDeleted){
        removePatientDiv(button)
      }
    }
    else if(button.classList.contains(ButtonClass.EDIT)){
      editPatient(button)
    }

  })
}

document.addEventListener("DOMContentLoaded", function (){
  const formRegister = document.querySelector('#formCadastro');
  const formEdit = document.querySelector('#formEdicao');
  const btnCloseModal = document.querySelector("#btnFecharModal")
  const btnCancelar = document.querySelector("#btnCancelar")
  

  setupPatientActions()

  formRegister.addEventListener('submit', createPatient);
  btnCloseModal.addEventListener('click', closeModal)
  btnCancelar.addEventListener('click', closeModal)
  formEdit.addEventListener('submit', updatePatient)


})
