import { ButtonClass } from "./enums/targetButtonEnum.js"
import { createMedic, getMedics, deleteMedic, updateMedic } from "../services/medicsService.js"
import { getSpecialties } from "../services/especialidadesService.js"
import { getConsultations } from "../services/consultasService.js"
import { showToast } from "../utils/toast.js"

let specialtiesMap = new Map()

export function insertMedicList(name, specialtyId, id){
  const container = document.querySelector("#lista-medicos")

  const div = document.createElement("div")
  div.className = "flex justify-between items-center bg-white border rounded-lg p-4 shadow-sm mb-2"

  const specialtyName = specialtiesMap.get(Number(specialtyId)) || "-"

  div.innerHTML = `
    <div>
      <p class="font-semibold text-gray-800">${name}</p>
      <p class="text-sm text-gray-500">Especialidade: ${specialtyName}</p>
    </div>
    <div class="flex gap-2">
      <button medic-id="${id}" class="p-2 bg-gray-100 rounded hover:bg-gray-200 view-consultations">
        👁️
      </button>
      <button medic-id="${id}" medic-name="${name}" medic-specialty="${specialtyId}" class="p-2 bg-gray-100 rounded hover:bg-gray-200 edit-medic">
        ✏️
      </button>
      <button medic-id="${id}" class="p-2 bg-red-600 text-white rounded hover:bg-red-500 delete-medic">
        🗑️
      </button>
    </div>
  `

  container.append(div)
}

function removeMedicDiv(bttn){
  const div = bttn.parentElement.parentElement
  if(div) div.remove()
}

function openModal(){
  const modal = document.querySelector("#modalMedico")
  const modalContent = document.querySelector("#modalContent")
  modal.classList.remove("hidden")
  modal.classList.add("flex")
  setTimeout(() => {
    modalContent.classList.remove("scale-95", "opacity-0")
    modalContent.classList.add("scale-100", "opacity-100")
  }, 10)
}

export function closeModal(){
  const modal = document.querySelector("#modalMedico")
  const modalContent = document.querySelector("#modalContent")
  modalContent.classList.remove("scale-100", "opacity-100")
  modalContent.classList.add("scale-95", "opacity-0")
  setTimeout(() => {
    modal.classList.add("hidden")
    modal.classList.remove("flex")
  }, 300)
}

function editMedic(bttn){
  const form = document.querySelector("#formEdicao")
  const currentName = bttn.getAttribute('medic-name')
  const currentSpecialty = bttn.getAttribute('medic-specialty')
  const medicId = bttn.getAttribute('medic-id')

  form.querySelector('input[name="nome"]').value = currentName
  const sel = form.querySelector('select[name="especialidade"]')
  if(sel) sel.value = currentSpecialty

  form.setAttribute('medic-id', medicId)
  openModal()
}

function setupMedicActions(){
  const container = document.querySelector('#lista-medicos')
  container.addEventListener('click', async function(event){
    const button = event.target.closest('button')
    if(!button) return

    if(button.classList.contains(ButtonClass.DELETE_MEDIC)){
      const isDeleted = await deleteMedic(button)
      if(isDeleted) removeMedicDiv(button)
    } else if(button.classList.contains(ButtonClass.EDIT_MEDIC)){
      editMedic(button)
    } else if(button.classList.contains('view-consultations')){
      const medicId = Number(button.getAttribute('medic-id'))
      const medicName = button.getAttribute('medic-name') || 'Médico'
      const allConsultations = await getConsultations()
      const filtered = allConsultations.filter(c => Number(c.idMedico) === medicId)
      showConsultationsModal(filtered, medicName)
    }
  })
}

async function showConsultationsModal(consultations, medicName){
  const BASE_URL = "https://ifsp.ddns.net/webservices/clinicaMedica"
  
  try {
    const patientsRes = await fetch(`${BASE_URL}/pacientes`)
    const patients = await patientsRes.json()
    const patientsMap = new Map(patients.map(p => [Number(p.id), p.nome]))
    
    showConsultationsModalView(consultations, medicName, patientsMap, 'medico')
  } catch(err) {
    console.error(err)
    showConsultationsModalView(consultations, medicName, new Map(), 'medico')
  }
}

function showConsultationsModalView(consultations, name, namesMap, type){
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
      
      const otherName = type === 'medico' 
        ? (namesMap.get(Number(c.idPaciente)) || `Paciente #${c.idPaciente}`)
        : (namesMap.get(Number(c.idMedico)) || `Médico #${c.idMedico}`)
      
      const otherLabel = type === 'medico' ? 'Paciente' : 'Médico'
      
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

async function populateSpecialties(selects = [], isFilter = false){
  const specialties = await getSpecialties()
  specialtiesMap = new Map(specialties.map(s => [Number(s.id), s.nome]))

  for(const sel of selects){
    sel.innerHTML = ''
    const placeholder = document.createElement('option')
    placeholder.value = ''
    
    if(isFilter || sel.id === 'filtroEspecialidade'){
      placeholder.disabled = false
      placeholder.selected = true
      placeholder.textContent = 'Todas as especialidades'
    } else {
      placeholder.disabled = true
      placeholder.selected = true
      placeholder.textContent = sel.getAttribute('data-placeholder') || 'Selecione uma especialidade'
    }
    sel.append(placeholder)

    for(const esp of specialties){
      const opt = document.createElement('option')
      opt.value = String(esp.id)
      opt.textContent = esp.nome
      sel.append(opt)
    }
  }
}

async function loadMedics(){
  const medics = await getMedics()
  const container = document.querySelector('#lista-medicos')
  container.innerHTML = ''
  medics.forEach(m => insertMedicList(m.nome, m.idEspecialidade, m.id))
}

export async function reloadMedicList(){
  await loadMedics()
}

document.addEventListener('DOMContentLoaded', async function(){
  const formRegister = document.querySelector('#formCadastro')
  const formEdit = document.querySelector('#formEdicao')
  const btnCloseModal = document.querySelector('#btnFecharModal')
  const btnCancelar = document.querySelector('#btnCancelar')

  const selectRegister = document.querySelector('select[name="especialidade"]')
  const selectFilter = document.querySelector('#filtroEspecialidade')
  const selectEdit = document.querySelector('#formEdicao select[name="especialidade"]')

  await populateSpecialties([selectRegister, selectEdit])
  if(selectFilter) await populateSpecialties([selectFilter], true)

  await loadMedics()
  setupMedicActions()

  formRegister.addEventListener('submit', createMedic)
  formEdit.addEventListener('submit', updateMedic)
  btnCloseModal.addEventListener('click', closeModal)
  btnCancelar.addEventListener('click', closeModal)

  if(selectFilter){
    selectFilter.addEventListener('change', async function(){
      const val = this.value
      const medics = await getMedics()
      const container = document.querySelector('#lista-medicos')
      container.innerHTML = ''
      medics.filter(m => !val || String(m.idEspecialidade) === String(val)).forEach(m => insertMedicList(m.nome, m.idEspecialidade, m.id))
    })
  }

})
