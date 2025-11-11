function showToast(message, type = "success") {
  const toast = document.createElement("div");

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  toast.className =
    `fixed top-4 right-4 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 opacity-0 ${colors[type]}`;

  toast.textContent = message;

    document.body.append(toast)

  setTimeout(() => toast.classList.add("opacity-100"), 10);


  setTimeout(() => {
    toast.classList.remove("opacity-100");
    setTimeout(() => (toast.className += " hidden"), 300);
  }, 3000);
}


