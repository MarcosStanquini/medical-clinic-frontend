import { createConsultation, getConsultations, deleteConsultation } from "../services/consultasService.js"
import { showToast } from "../utils/toast.js"
import { getPatients } from "../services/patientsService.js"
import { getMedics } from "../services/medicsService.js"

const BASE_URL = "https://ifsp.ddns.net/webservices/clinicaMedica"

let patientsMap = new Map()
let medicsMap = new Map()

function insertConsultationList(c){
  const container = document.querySelector('#lista-consultas')
  const div = document.createElement('div')
  div.className = 'flex justify-between items-center border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow bg-white'
  
  const patientName = patientsMap.get(Number(c.idPaciente)) || `Paciente #${c.idPaciente}`
  const medicName = medicsMap.get(Number(c.idMedico)) || `Médico #${c.idMedico}`
  
  div.innerHTML = `
    <div class="flex-1">
      <div class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        ${c.data}
      </div>
      <div class="text-sm text-gray-600 ml-7 space-y-1">
        <div><span class="font-medium">Paciente:</span> ${patientName}</div>
        <div><span class="font-medium">Médico:</span> ${medicName}</div>
      </div>
    </div>
    <div>
      <button consulta-id="${c.id}" class="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 delete-consultation transition-colors">
        🗑️
      </button>
    </div>
  `
  container.append(div)
}

function clearConsultations(){
  const container = document.querySelector('#lista-consultas')
  container.innerHTML = ''
}

async function loadConsultations(filter = {}){
  const consultations = await getConsultations()
  let filtered = consultations
  if(filter.medicId) filtered = filtered.filter(c => Number(c.idMedico) === Number(filter.medicId))
  if(filter.patientId) filtered = filtered.filter(c => Number(c.idPaciente) === Number(filter.patientId))

  clearConsultations()
  filtered.forEach(c => insertConsultationList(c))
}

function setupActions(){
  const list = document.querySelector('#lista-consultas')
  list.addEventListener('click', async function(e){
    const btn = e.target.closest('button')
    if(!btn) return
    if(btn.classList.contains('delete-consultation')){
      const ok = await deleteConsultation(btn)
      if(ok) btn.parentElement.parentElement.remove()
    }
  })
}

document.addEventListener('DOMContentLoaded', async function(){
  const selectPatient = document.querySelector('#paciente')
  const selectMedic = document.querySelector('#medico')
  const form = document.querySelector('#formAgendarConsulta')

  const patients = await getPatients()
  const medics = await getMedics()
  
  patientsMap = new Map(patients.map(p => [Number(p.id), p.nome]))
  medicsMap = new Map(medics.map(m => [Number(m.id), m.nome]))

  patients.forEach(p => {
    const opt = document.createElement('option')
    opt.value = String(p.id)
    opt.textContent = p.nome
    selectPatient.append(opt)
  })

  medics.forEach(m => {
    const opt = document.createElement('option')
    opt.value = String(m.id)
    opt.textContent = m.nome
    selectMedic.append(opt)
  })

  await loadConsultations()
  setupActions()


  selectMedic.addEventListener('change', function(){
    const medicId = this.value
    const patientId = selectPatient.value
    loadConsultations({ medicId: medicId || undefined, patientId: patientId || undefined })
  })
  selectPatient.addEventListener('change', function(){
    const patientId = this.value
    const medicId = selectMedic.value
    loadConsultations({ medicId: medicId || undefined, patientId: patientId || undefined })
  })

  form.addEventListener('submit', async function(e){
    const result = await createConsultation(e)
    if(result) {
      const filter = { medicId: selectMedic.value || undefined, patientId: selectPatient.value || undefined }
      await loadConsultations(filter)
    }
  })

})
