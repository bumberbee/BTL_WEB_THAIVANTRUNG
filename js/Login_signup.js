document.addEventListener("DOMContentLoaded", () => {
  // ===== Lấy & Lưu người dùng =====
  const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
  const saveUsers = (users) => localStorage.setItem("users", JSON.stringify(users));

  // ===== Xử lý Đăng ký =====
  document.getElementById("signup-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("new-username").value.trim();
    const password = document.getElementById("new-password").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const phoneRegex = /^0\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Xóa lỗi cũ
    document.getElementById("signup-username-error").textContent = "";
    document.getElementById("signup-password-error").textContent = "";
    document.getElementById("signup-phone-error").textContent = "";
    document.getElementById("signup-email-error").textContent = "";

    let isValid = true;

    if (!usernameRegex.test(username)) {
      document.getElementById("signup-username-error").textContent =
        "Tên tài khoản phải có ít nhất 4 ký tự và không chứa ký tự đặc biệt.";
      isValid = false;
    }

    if (!passwordRegex.test(password)) {
      document.getElementById("signup-password-error").textContent =
        "Mật khẩu phải ít nhất 6 ký tự, gồm chữ và số.";
      isValid = false;
    }

    if (!phoneRegex.test(phone)) {
      document.getElementById("signup-phone-error").textContent =
        "Số điện thoại không hợp lệ. Phải có 10 số và bắt đầu bằng 0.";
      isValid = false;
    }

    if (!emailRegex.test(email)) {
      document.getElementById("signup-email-error").textContent =
        "Email không hợp lệ.";
      isValid = false;
    }

    const users = getUsers();
    if (users.some(u => u.username === username)) {
      document.getElementById("signup-username-error").textContent =
        "Tên tài khoản đã tồn tại.";
      isValid = false;
    }

    if (isValid) {
      users.push({ username, password, phone, email });
      saveUsers(users);
      alert("Đăng ký thành công!");

      setTimeout(() => {
        document.getElementById("signup-modal").style.display = "none";
        document.getElementById("login-modal").style.display = "block";
      }, 1000);
    }
  });

  // ===== Xử lý Đăng nhập =====
  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    document.getElementById("login-username-error").textContent = "";
    document.getElementById("login-password-error").textContent = "";

    const users = getUsers();
    const foundUser = users.find(u => u.username === username);

    if (foundUser && foundUser.password === password) {
      document.getElementById("login-modal").style.display = "none";
      document.getElementById("auth-buttons").style.display = "none";
      document.getElementById("user-info").style.display = "flex";
      document.getElementById("user-name").textContent = "👤 " + username;
      document.getElementById("cart-count").textContent = "🛒 0";

      localStorage.setItem("currentUser", username);

      activateSubmenus(); // Kích hoạt menu con sau đăng nhập
    } else {
      if (!foundUser) {
        document.getElementById("login-username-error").textContent =
          "Tên tài khoản không đúng.";
      } else {
        document.getElementById("login-password-error").textContent =
          "Mật khẩu không đúng.";
      }
    }
  });

  // ===== Đăng xuất =====
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      document.getElementById("auth-buttons").style.display = "block";
      document.getElementById("user-info").style.display = "none";
    });
  }

  // ===== Mở/đóng Modal =====
  document.getElementById("signup-btn").onclick = () => {
    document.getElementById("signup-modal").style.display = "block";
    document.getElementById("login-modal").style.display = "none";
    document.querySelector("#navheader").classList.add("navheader-no-hover");
  };

  document.getElementById("login-btn").onclick = () => {
    document.getElementById("login-modal").style.display = "block";
    document.getElementById("signup-modal").style.display = "none";
    document.querySelector("#navheader").classList.add("navheader-no-hover");
  };

  document.getElementById("close-signup").onclick = () => {
    document.getElementById("signup-modal").style.display = "none";
    document.querySelector("#navheader").classList.remove("navheader-no-hover");
  };

  document.getElementById("close-login").onclick = () => {
    document.getElementById("login-modal").style.display = "none";
    document.querySelector("#navheader").classList.remove("navheader-no-hover");
  };

  const goToSignup = document.getElementById("switch-to-signup");
  if (goToSignup) {
    goToSignup.addEventListener("click", () => {
      document.getElementById("signup-modal").style.display = "block";
      document.getElementById("login-modal").style.display = "none";
      document.querySelector("#navheader").classList.add("navheader-no-hover");
    });
  }
  
const goToLogin = document.getElementById("switch-to-login");
if (goToLogin) {
  goToLogin.addEventListener("click", () => {

    document.getElementById("signup-modal").style.display = "none";
    document.getElementById("login-modal").style.display = "block";
    document.querySelector("#navheader").classList.add("navheader-no-hover");
  });
}


  // ===== Kích hoạt submenu khi đăng nhập =====
  function activateSubmenus() {
    const navItems = document.querySelectorAll("#navheader > ul > li");

    navItems.forEach(item => {
      const submenu = item.querySelector(".submenu");
      if (submenu) {
        item.addEventListener("mouseenter", () => {
          submenu.style.display = "block";
        });
        item.addEventListener("mouseleave", () => {
          submenu.style.display = "none";
        });
      }
    });
  }

  // ===== Tải lại: reset về chưa đăng nhập nếu không có currentUser =====
  if (localStorage.getItem("currentUser")) {
    const username = localStorage.getItem("currentUser");
    document.getElementById("auth-buttons").style.display = "none";
    document.getElementById("user-info").style.display = "flex";
    document.getElementById("user-name").textContent = "👤 " + username;
    document.getElementById("cart-count").textContent = "🛒 ";
    activateSubmenus();
  } else {
    document.getElementById("auth-buttons").style.display = "block";
    document.getElementById("user-info").style.display = "none";
  }
});
