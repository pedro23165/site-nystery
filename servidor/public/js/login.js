document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const phone = document.getElementById("loginPhone").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

  const user = existingUsers.find(user => user.phone === phone && user.password === password);

  if (user) {
      alert("Login bem-sucedido!");
      // Aqui você pode redirecionar para uma nova página ou realizar outra ação
       window.location.href = 'pagina.html'; 
  } else {
      alert("Número de telefone ou senha incorretos.");
  }
});
