function patientData(){
    const form = document.querySelector("form")

    let name = form.querySelector('input[name="nome"]').value
    let dateOfBirth = form.querySelector('input[name="data-nascimento"]').value

    return {
        nome: name,
        dataNascimento: dateOfBirth
    }
}

function insertPatientList(name, dateOfBirth) {
  const container = document.querySelector("#lista-pacientes")

  const div = document.createElement("div");
  div.className = "flex justify-between items-center bg-white border rounded-lg p-4 shadow-sm mb-2";

  div.innerHTML = `
    <div>
      <p class="font-semibold text-gray-800">${name}</p>
      <p class="text-sm text-gray-500">Nascimento: ${dateOfBirth}</p>
    </div>
    <div class="flex gap-2">
      <button class="p-2 bg-gray-100 rounded hover:bg-gray-200">
        👁️
      </button>
      <button class="p-2 bg-gray-100 rounded hover:bg-gray-200">
        ✏️
      </button>
      <button class="p-2 bg-red-600 text-white rounded hover:bg-red-500">
        🗑️
      </button>
    </div>
  `;

  container.append(div);
}

const form = document.querySelector('form');
form.addEventListener('submit', createPatient);


