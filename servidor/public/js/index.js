
if (localStorage.getItem("token") == null) {
  alert("Você precisa estar logado para acessar essa página");
  window.location.href = "/html/login.html"; 
} else {

  const userLogado = JSON.parse(localStorage.getItem("userLogado"));

 
  if (userLogado && userLogado.nome) {
    const logado = document.querySelector("#logado");
    if (logado) {
      logado.innerHTML = `Olá, ${userLogado.nome}!`;
    } else {
      console.error('Elemento com id="logado" não foi encontrado no HTML.');
    }
  } else {
    console.error(
      "Objeto userLogado inválido ou propriedade 'nome' ausente. Redirecionando..."
    );
    window.location.href = "/login"; 
  }
}

// Função para sair
function sair() {
  localStorage.removeItem("token"); 
  localStorage.removeItem("userLogado"); 
  window.location.href = "/login.html"; 
}
