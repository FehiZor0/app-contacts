const API_URL = "http://localhost:8000";

// =========================
// Variables
// =========================

// Tous les contacts récupérés depuis l'API
let tousLesContacts = [];

// null = mode ajout
// un nombre = ID du contact en modification
let contactEnModification = null;

// =========================
// Charger les contacts
// =========================

async function chargerContacts() {
  try {
    const response = await fetch(`${API_URL}/contacts`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des contacts");
    }

    const contacts = await response.json();

    // Conserver tous les contacts
    tousLesContacts = contacts;

    // Afficher les contacts
    afficherContacts(contacts);
  } catch (error) {
    console.error("Erreur :", error);
  }
}

// =========================
// Afficher les contacts
// =========================

function afficherContacts(contacts) {
  const tableBody = document.getElementById("contactsTableBody");

  // Vider le tableau
  tableBody.innerHTML = "";

  contacts.forEach((contact) => {
    const ligne = document.createElement("tr");

    ligne.innerHTML = `

            <td>${contact.nom}</td>

            <td>${contact.prenom}</td>

            <td>${contact.email}</td>

            <td>${contact.telephone || "-"}</td>

            <td>

                <div class="action-buttons">

                    <button
                        class="btn-edit"
                        onclick="modifierContact(${contact.id})">
                        Modifier
                    </button>


                    <button
                        class="btn-delete"
                        onclick="supprimerContact(${contact.id})">
                        Supprimer
                    </button>

                </div>

            </td>
        `;

    tableBody.appendChild(ligne);
  });
}

// =========================
// Éléments du formulaire
// =========================

const modal = document.getElementById("contactModal");

const btnAjouter = document.getElementById("btnAjouter");

const btnFermer = document.getElementById("btnFermer");

const btnAnnuler = document.getElementById("btnAnnuler");

const contactForm = document.getElementById("contactForm");

const modalTitle = document.getElementById("modalTitle");

// =========================
// Ajouter un contact
// =========================

btnAjouter.addEventListener("click", () => {
  // Mode ajout
  contactEnModification = null;

  // Modifier le titre
  modalTitle.textContent = "Ajouter un contact";

  // Vider le formulaire
  contactForm.reset();

  // Afficher le formulaire
  modal.style.display = "flex";
});

// =========================
// Fermer le formulaire
// =========================

btnFermer.addEventListener("click", () => {
  modal.style.display = "none";
});

btnAnnuler.addEventListener("click", () => {
  modal.style.display = "none";
});

// =========================
// Ajouter OU modifier
// =========================

contactForm.addEventListener("submit", async (event) => {
  // Empêcher le rechargement de la page
  event.preventDefault();

  // Récupérer les données du formulaire
  const contact = {
    nom: document.getElementById("nom").value,

    prenom: document.getElementById("prenom").value,

    email: document.getElementById("email").value,

    telephone: document.getElementById("telephone").value || null,
  };

  try {
    let response;

    // =========================
    // MODE MODIFICATION
    // =========================

    if (contactEnModification !== null) {
      response = await fetch(`${API_URL}/contacts/${contactEnModification}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(contact),
      });
    }

    // =========================
    // MODE AJOUT
    // =========================
    else {
      response = await fetch(`${API_URL}/contacts`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(contact),
      });
    }

    // Vérifier la réponse
    if (!response.ok) {
      throw new Error("Erreur lors de l'enregistrement du contact");
    }

    // Fermer le formulaire
    modal.style.display = "none";

    // Vider le formulaire
    contactForm.reset();

    // Revenir au mode ajout
    contactEnModification = null;

    // Recharger les contacts
    chargerContacts();
  } catch (error) {
    console.error("Erreur :", error);
  }
});

// =========================
// Modifier un contact
// =========================

async function modifierContact(id) {
  try {
    // Récupérer le contact
    const response = await fetch(`${API_URL}/contacts/${id}`);

    if (!response.ok) {
      throw new Error("Contact introuvable");
    }

    const contact = await response.json();

    // Enregistrer l'ID du contact
    contactEnModification = id;

    // Modifier le titre
    modalTitle.textContent = "Modifier le contact";

    // Remplir le formulaire
    document.getElementById("nom").value = contact.nom;

    document.getElementById("prenom").value = contact.prenom;

    document.getElementById("email").value = contact.email;

    document.getElementById("telephone").value = contact.telephone || "";

    // Ouvrir le formulaire
    modal.style.display = "flex";
  } catch (error) {
    console.error("Erreur :", error);
  }
}

// =========================
// Supprimer un contact
// =========================

async function supprimerContact(id) {
  // Demander confirmation
  const confirmation = confirm("Voulez-vous vraiment supprimer ce contact ?");

  // Si l'utilisateur annule
  if (!confirmation) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression");
    }

    // Recharger les contacts
    chargerContacts();
  } catch (error) {
    console.error("Erreur :", error);
  }
}

// =========================
// Recherche
// =========================

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  // Texte recherché
  const recherche = searchInput.value.toLowerCase();

  // Filtrer les contacts
  const contactsFiltres = tousLesContacts.filter((contact) => {
    return (
      contact.nom.toLowerCase().includes(recherche) ||
      contact.prenom.toLowerCase().includes(recherche) ||
      contact.email.toLowerCase().includes(recherche) ||
      (contact.telephone || "").includes(recherche)
    );
  });

  // Afficher les résultats
  afficherContacts(contactsFiltres);
});

// =========================
// Démarrage de l'application
// =========================

chargerContacts();
