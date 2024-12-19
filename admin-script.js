// URL Google Apps Script
const scriptURL =
  "https://script.google.com/macros/s/AKfycbx60cS25q4ocnsAOf6WXLURHrullXmAkrIFOyy1E4G19-eQMmmyGMHoKa9U4cZGVkAfuw/exec";

// Initialize dashboard
document.addEventListener("DOMContentLoaded", function () {
  // Show admin email from session storage
  document.getElementById("adminEmail").textContent =
    sessionStorage.getItem("userEmail");

  // Load initial data
  loadDashboardData();

  // Setup event listeners
  setupEventListeners();
});

// Load dashboard data
async function loadDashboardData() {
  try {
    const response = await fetch(`${scriptURL}?action=getDashboardData`);
    const data = await response.json();

    if (data.success) {
      // Update statistics
      document.getElementById("totalSimpananPokok").textContent =
        formatCurrency(data.totalSimpananPokok);
      document.getElementById("totalSimpananWajib").textContent =
        formatCurrency(data.totalSimpananWajib);
      document.getElementById("totalDipinjamkan").textContent = formatCurrency(
        data.totalDipinjamkan
      );
      document.getElementById("totalSalesAdmin").textContent = formatCurrency(
        data.totalSalesAdmin
      );

      // Populate table
      populateTable(data.userData);
    } else {
      showError("Failed to load dashboard data");
    }
  } catch (error) {
    console.error("Error:", error);
    showError("Error loading dashboard data");
  }
}

// Populate table with user data
function populateTable(userData) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  userData.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${user.nama}</td>
            <td>${user.id}</td>
            <td>${formatCurrency(user.simpananPokok)}</td>
            <td>${formatCurrency(user.simpananWajib)}</td>
            <td>${formatCurrency(user.pinjaman)}</td>
            <td>${formatCurrency(user.tagihan)}</td>
            <td>
                <button class="action-btn" onclick="showUserDetails('${
                  user.id
                }')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

// Setup event listeners
function setupEventListeners() {
  // Toggle dropdowns
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    dropdown.addEventListener("click", function () {
      this.querySelector(".dropdown-content").classList.toggle("show");
    });
  });

  // Navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", function () {
      if (!this.classList.contains("dropdown")) {
        document
          .querySelectorAll(".nav-item")
          .forEach((nav) => nav.classList.remove("active"));
        this.classList.add("active");
        handleNavigation(this);
      }
    });
  });

  // Search functionality
  document
    .getElementById("searchInput")
    .addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const rows = document.querySelectorAll("#tableBody tr");

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? "" : "none";
      });
    });

  // Logout handler
  document
    .querySelector(".nav-item:last-child")
    .addEventListener("click", function () {
      sessionStorage.clear();
      window.location.href = "index.html";
    });
}

// Handle navigation
function handleNavigation(element) {
  const text = element.textContent.trim();
  switch (text) {
    case "Dashboard":
      loadDashboardData();
      break;
    case "Anggota":
      window.location.href = "anggota.html";
      break;
    case "Simpanan Pokok":
      window.location.href = "simpananpokok.html";
      break;
    case "Simpanan Wajib":
      window.location.href = "simpananwajib.html";
      break;
    case "Login Users":
      window.location.href = "loginusers.html";
      break;
    // Add other navigation cases as needed
  }
}

// Show user details modal
async function showUserDetails(userId) {
  try {
    const response = await fetch(
      `${scriptURL}?action=getUserDetails&userId=${userId}`
    );
    const data = await response.json();

    if (data.success) {
      const modal = document.getElementById("userModal");
      const modalContent = document.getElementById("userModalContent");

      modalContent.innerHTML = `
                <h2>Detail User</h2>
                <p><strong>Nama:</strong> ${data.user.nama}</p>
                <p><strong>ID:</strong> ${data.user.id}</p>
                <p><strong>Email:</strong> ${data.user.email}</p>
                <p><strong>Status:</strong> ${data.user.status}</p>
                <p><strong>Simpanan Pokok:</strong> ${formatCurrency(
                  data.user.simpananPokok
                )}</p>
                <p><strong>Simpanan Wajib:</strong> ${formatCurrency(
                  data.user.simpananWajib
                )}</p>
                <p><strong>Total Pinjaman:</strong> ${formatCurrency(
                  data.user.pinjaman
                )}</p>
                <p><strong>Tagihan:</strong> ${formatCurrency(
                  data.user.tagihan
                )}</p>
            `;

      modal.style.display = "block";
    } else {
      showError("Failed to load user details");
    }
  } catch (error) {
    console.error("Error:", error);
    showError("Error loading user details");
  }
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
}

function showError(message) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
  });
}
