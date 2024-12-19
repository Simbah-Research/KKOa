// URL Google Apps Script
const scriptURL =
  "https://script.google.com/macros/s/AKfycbx60cS25q4ocnsAOf6WXLURHrullXmAkrIFOyy1E4G19-eQMmmyGMHoKa9U4cZGVkAfuw/exec";

// Toggle Password Visibility
document.querySelectorAll(".toggle-password").forEach((toggle) => {
  toggle.addEventListener("click", function () {
    const password = this.closest(".input-group").querySelector("input");
    const icon = this.querySelector("i");

    if (password.type === "password") {
      password.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      password.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
});

// Handle Register
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  if (formData.get("password") !== formData.get("confirmPassword")) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Password tidak cocok!",
    });
    return;
  }

  formData.append("action", "register");

  fetch(scriptURL, { method: "POST", body: formData })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Registrasi berhasil! Silakan cek email Anda untuk kode verifikasi.",
        }).then(() => {
          $('.nav-tabs a[href="#verify"]').tab("show");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Registrasi gagal!",
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan!",
      });
    });
});

// Handle Login
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  formData.append("action", "login");
  formData.append("userAgent", navigator.userAgent);

  document.querySelector(".loading-spinner").style.display = "block";

  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      formData.append("ipAddress", data.ip);
      return fetch(scriptURL, { method: "POST", body: formData });
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Full response data:", data); // Log seluruh response

      if (data.success) {
        sessionStorage.setItem("userEmail", data.userEmail);
        sessionStorage.setItem("userName", data.userName);

        // Detailed debugging for posisi
        console.log("Posisi value:", data.posisi);
        console.log("Posisi type:", typeof data.posisi);
        console.log(
          "Posisi length:",
          data.posisi ? data.posisi.length : "undefined"
        );
        console.log("Is 'Admin'?:", data.posisi === "Admin");
        console.log("Is 'User'?:", data.posisi === "User");

        // Check for whitespace
        if (data.posisi) {
          console.log("Posisi with whitespace removed:", data.posisi.trim());
          console.log(
            "Character codes:",
            Array.from(data.posisi).map((c) => c.charCodeAt(0))
          );
        }

        // Route based on user position with additional logging
        if (data.posisi && data.posisi.trim() === "Admin") {
          console.log("✅ Routing to admin.html");
          window.location.href = "admin.html";
        } else {
          console.log(
            "❌ Routing to user.html because posisi is:",
            data.posisi
          );
          window.location.href = "user.html";
        }
      } else {
        // ... kode error handling yang sama ...
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan!",
      });
    })
    .finally(() => {
      document.querySelector(".loading-spinner").style.display = "none";
    });
});

// Handle Verification
document.getElementById("verifyForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  formData.append("action", "verify");

  fetch(scriptURL, { method: "POST", body: formData })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Email berhasil diverifikasi! Silakan login.",
        }).then(() => {
          $('.nav-tabs a[href="#login"]').tab("show");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Verifikasi gagal!",
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan!",
      });
    });
});

// Handle Forgot Password Modal
document
  .getElementById("forgotPasswordLink")
  .addEventListener("click", function (e) {
    e.preventDefault();
    $("#forgotPasswordModal").modal("show");
  });

// Handle Forgot Password Form Submission
document
  .getElementById("forgotPasswordForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("forgotPasswordName").value;
    const email = document.getElementById("forgotPasswordEmail").value;
    const message = document.getElementById("forgotPasswordMessage").value;

    // Format the message for WhatsApp
    const whatsappMessage = `Nama: ${name}%0AEmail: ${email}%0APesan: ${message}`;

    // WhatsApp link with pre-filled message
    const whatsappLink = `https://wa.me/62895626314747?text=${whatsappMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappLink, "_blank");

    // Close the modal
    $("#forgotPasswordModal").modal("hide");

    // Reset form
    this.reset();
  });
// Handle Notif Register
document
  .getElementById("registerTabLink")
  .addEventListener("click", function (e) {
    e.preventDefault();

    Swal.fire({
      title: "Penting!",
      html: `
          <div>
              <p style="margin-bottom: 0.5rem">
                  Gunakan kata sandi yang mudah di ingat!! Pastikan nama sesuai ID/KTP. Jangan menggunakan 
                  kata sandi yang sama untuk mengakses data penting. Kami berkomitmen menjaga keamanan data Anda.
              </p>
              <div style="color: #666;">
                  Terima kasih,<br>
                  <em>Admin</em>
              </div>
          </div>
      `,
      icon: "info",
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#00a651",
    }).then((result) => {
      if (result.isConfirmed) {
        $('.nav-tabs a[href="#register"]').tab("show");
      }
    });
  });

// Ensure video background fits screen on resize
window.addEventListener("resize", function () {
  const video = document.getElementById("bgVideo");
  if (video) {
    video.style.height = window.innerHeight + "px";
  }
});

// Initialize video height on load
window.addEventListener("load", function () {
  const video = document.getElementById("bgVideo");
  if (video) {
    video.style.height = window.innerHeight + "px";
  }
});
