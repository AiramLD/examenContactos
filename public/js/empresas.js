const dominio = "http://localhost:3000";

window.onload = () => {
  mostrarEmpresas();
  cargarEstadoSeleccion();
};

//CREAR NUEVA EMPRESA
async function crearNuevaEmpresa(event) {
  const empresasLista = document.getElementById("companies-list");
  event.preventDefault();

  let name = document.getElementById("name").value;
  let newData = {
    name,
  };
  let res = await fetch(dominio + "/api/companies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  });
  mostrarEmpresas();
}

document.forms["form_create"].addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const industry = document.getElementById("industry").value;
  const sector = document.getElementById("sector").value;
  const capital = document.getElementById("capital").value;

  if (!name) {
    alert("El nombre de la empresa debe ser proporcionado.");
    return;
  }
  const newCompany = {
    name: name,
    industry: industry,
    sector: sector,
    capital: capital,
  };

  fetch(dominio + "/api/companies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCompany),
  })
    .then((res) => res.json())
    .then((createdCompany) => {
      console.log("Empresa creada:", createdCompany);

      this.reset();

      mostrarEmpresas();
    })
    .catch((error) => {
      console.error("Error al crear la empresa:", error);
    });
});
document.querySelector("tbody").addEventListener("click", function (event) {
  const clickedElement = event.target;

  if (clickedElement.tagName === "TD") {
    const tr = clickedElement.parentElement;

    tr.classList.toggle("marcada");

    guardarEstadoSeleccion();
  }
});

//GUARDAR SI HAN SIDO SELECCIONADAS
function guardarEstadoSeleccion() {
  const empresasSeleccionadas = [];

  document.querySelectorAll("tbody tr.marcada").forEach(function (tr) {
    const id = tr.querySelector("td:first-child").innerText;
    empresasSeleccionadas.push(id);
  });

  localStorage.setItem(
    "empresasSeleccionadas",
    JSON.stringify(empresasSeleccionadas)
  );
}

function cargarEstadoSeleccion() {
  const empresasSeleccionadas =
    JSON.parse(localStorage.getItem("empresasSeleccionadas")) || [];

  empresasSeleccionadas.forEach(function (id) {
    const tr = document.querySelector(
      `tbody tr td:first-child:contains('${id}')`
    ).parentElement;
    tr.classList.add("marcada");
  });
}

cargarEstadoSeleccion();

//MOSTRAR EMPRESAS
function mostrarEmpresas() {
  fetch(dominio + "/api/companies")
    .then((res) => res.json())
    .then((companies) => {
      let tbody = document.querySelector("tbody");
      tbody.innerHTML = "";

      companies.forEach((company) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${company.id}</td>
          <td>${company.name}</td>
          <td>${company.industry}</td>
          <td>${company.sector}</td>
          <td>${company.capital}</td>
        `;
        tbody.appendChild(tr);
      });
    });
}
