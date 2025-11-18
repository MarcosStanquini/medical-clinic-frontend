import {ButtonClass} from "./enums/targetButtonEnum.js"
import { createPatient, deletePatient, updatePatient } from "../services/patientsService.js"
import { getConsultations } from "../services/consultasService.js"

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
      <button patient-id="${id}" patient-name="${name}" class="p-2 bg-gray-100 rounded hover:bg-gray-200 view-patient-consultations">
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

export async function reloadPatientList(){
  const BASE_URL = "https://ifsp.ddns.net/webservices/clinicaMedica"
  
  try {
    const response = await fetch(`${BASE_URL}/pacientes`)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const result = await response.json()

    if(!Array.isArray(result)){
      throw new Error("Formato inesperado!")
    }

    const container = document.querySelector("#lista-pacientes")
    const title = container.querySelector('h2')
    container.innerHTML = ''
    if(title) container.append(title)

    for (const patient of result) {
      insertPatientList(patient.nome, patient.dataNascimento, patient.id)
    }
  } catch (err) {
    console.error(err)
  }
}

function removePatientDiv(bttn){
  let div = bttn.parentElement.parentElement
  if(div){
    div.remove()
  }
}

async function showPatientConsultationsModal(patientId, patientName){
  const BASE_URL = "https://ifsp.ddns.net/webservices/clinicaMedica"
  
  try {
    const [consultationsRes, medicsRes] = await Promise.all([
      fetch(`${BASE_URL}/consultas`),
      fetch(`${BASE_URL}/medicos`)
    ])
    
    const consultations = await consultationsRes.json()
    const medics = await medicsRes.json()
    
    const medicsMap = new Map(medics.map(m => [Number(m.id), m.nome]))
    const filtered = consultations.filter(c => Number(c.idPaciente) === Number(patientId))
    
    showConsultationsModal(filtered, patientName, medicsMap, 'paciente')
  } catch(err) {
    console.error(err)
    showConsultationsModal([], patientName, new Map(), 'paciente')
  }
}

function showConsultationsModal(consultations, name, namesMap, type){
  const modalId = 'modalConsultasView'
  let modal = document.querySelector(`#${modalId}`)
  if(modal) modal.remove()

  modal = document.createElement('div')
  modal.id = modalId
  modal.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300'
  
  const content = document.createElement('div')
  content.className = 'bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl relative transform transition-all duration-300'
  
  const closeBtn = document.createElement('button')
  closeBtn.className = 'absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-3xl font-bold leading-none'
  closeBtn.innerHTML = '×'
  closeBtn.addEventListener('click', () => modal.remove())
  
  const title = document.createElement('h3')
  title.className = 'text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3'
  title.innerHTML = `
    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
    </svg>
    Consultas de ${name}
  `
  
  content.append(closeBtn, title)
  
  if(consultations.length === 0){
    const empty = document.createElement('p')
    empty.className = 'text-gray-500 text-center py-4'
    empty.textContent = 'Nenhuma consulta agendada'
    content.append(empty)
  } else {
    const list = document.createElement('div')
    list.className = 'flex flex-col gap-3 max-h-96 overflow-y-auto'
    
    consultations.forEach(c => {
      const item = document.createElement('div')
      item.className = 'flex justify-between items-center border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-blue-50 to-white'
      
      const otherName = type === 'paciente' 
        ? (namesMap.get(Number(c.idMedico)) || `Médico #${c.idMedico}`)
        : (namesMap.get(Number(c.idPaciente)) || `Paciente #${c.idPaciente}`)
      
      const otherLabel = type === 'paciente' ? 'Médico' : 'Paciente'
      
      item.innerHTML = `
        <div class="flex-1">
          <div class="font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            ${c.data}
          </div>
          <div class="text-sm text-gray-600 ml-7">
            <span class="font-medium">${otherLabel}:</span> ${otherName}
          </div>
        </div>
      `
      list.append(item)
    })
    
    content.append(list)
  }
  
  const footer = document.createElement('div')
  footer.className = 'mt-6 flex justify-end'
  
  const btnClose = document.createElement('button')
  btnClose.className = 'bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg px-6 py-2 transition-colors'
  btnClose.textContent = 'Fechar'
  btnClose.addEventListener('click', () => modal.remove())
  
  footer.append(btnClose)
  content.append(footer)
  modal.append(content)
  document.body.append(modal)
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
    else if(button.classList.contains(ButtonClass.VIEW_PATIENT_CONSULTATIONS)){
      const patientId = Number(button.getAttribute('patient-id'))
      const patientName = button.getAttribute('patient-name') || 'Paciente'
      await showPatientConsultationsModal(patientId, patientName)
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
