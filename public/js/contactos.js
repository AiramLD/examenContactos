const HOST = "http://localhost:3000/api/";

document.addEventListener("DOMContentLoaded", () => {
  const contactsDiv = document.getElementById("contacts");
  const selectedCompanies = getSelectedCompanies();

  loadContacts(selectedCompanies);

  function getSelectedCompanies() {
    const selectedCompaniesString = localStorage.getItem("selectedCompanies");
    return selectedCompaniesString ? JSON.parse(selectedCompaniesString) : [];
  }
  

  async function loadContacts(selectedCompanies) {
    contactsDiv.innerHTML = '<p>Cargando datos...</p>';
    try {
      let endpoint = "contacts";
  
      if (selectedCompanies.length > 0) {
        const companiesQuery = selectedCompanies.join(',');
        endpoint = `companies/${companiesQuery}/contacts`;
      }
  
      const response = await fetch(HOST + endpoint);
  
      if (!response.ok) {
        throw new Error("Error al obtener los contactos");
      }
  
      const contacts = await response.json();
      displayContacts(contacts);
    } catch (error) {
      console.error("Error al cargar los contactos:", error);
      contactsDiv.innerHTML = '<p class="error">Error al cargar los contactos</p>';
    }
  }
  
  
  function displayContacts(contacts) {
    contactsDiv.innerHTML = "";
  
    contacts.forEach(contact => {
      const contactCard = createContactCard(contact);
      contactsDiv.appendChild(contactCard);
    });
  }
  
  function createContactCard(contact) {
    const contactCard = document.createElement("div");
    contactCard.classList.add("card");
  
    const companyName = getCompanyName(contact.company_id);
    const companyInfo = document.createElement("p");
    companyInfo.textContent = `Empresa: ${companyName}`;
    contactCard.appendChild(companyInfo);
  
    const contactInfo = document.createElement("p");
    contactInfo.textContent = `Nombre: ${contact.first_name} ${contact.last_name} Correo: ${contact.email}`;
    contactCard.appendChild(contactInfo);
  
    const photo = document.createElement("img");
    photo.src = "../img/" + contact.image;
    photo.alt = "Foto de perfil";
    contactCard.appendChild(photo);
  
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.addEventListener("click", () => deleteContact(contact.id));
    contactCard.appendChild(deleteButton);
  
    return contactCard;
  }
  
  function getCompanyName(companyName) {
    return companyName;
  }

  
  async function deleteContact(contactId) {
    try {
      const response = await fetch(`${HOST}contacts/${contactId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el contacto");
      }

      loadContacts(getSelectedCompanies());
    } catch (error) {
      console.error("Error al eliminar el contacto:", error);
      contactsDiv.innerHTML = '<p class="error">Error al eliminar el contacto</p>';
    }
  }
  
});

