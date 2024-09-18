async function addTodo() {
  const token = localStorage.getItem("token");
  const inp = document.getElementById("todo-input");
  const response = await axios.post(
    "http://localhost:3000/todos",
    {
      task: inp.value,
    },
    {
      headers: {
        token: token,
      },
    }
  );
  console.log(response.data);
  console.log(inp.value);
  render();
}

async function deleteTodo(ind) {
  const token = localStorage.getItem("token");
  const response = await axios.delete("http://localhost:3000/todos/" + ind, {
    headers: {
      token: token,
    },
  });
  render();
}

async function render() {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:3000/todos", {
    headers: {
      token: token,
    },
  });
  let todos = response.data;
  console.log(todos);
  document.querySelector(".todo-container").innerHTML = "";
  if (todos) {
    for (let i = 0; i < todos.length; i++) {
      const newH4 = document.createElement("h4");
      const newButton = document.createElement("button");
      console.log("ghiii");
      console.log(todos[i].task);
      newH4.textContent = todos[i].task;
      newButton.textContent = "Delete";
      newButton.setAttribute("onclick", "deleteTodo(" + todos[i].id + ")");
      const newDiv = document.createElement("div");
      newDiv.appendChild(newH4);
      newDiv.appendChild(newButton);
      document.querySelector(".todo-container").appendChild(newDiv);
    }
  }
}

async function signup() {
  const username = document.getElementById("signup_username").value;
  const password = document.getElementById("signup_password").value;
  console.log(username + password);
  const response = await axios.post("http://localhost:3000/signup", {
    username,
    password,
  });
  console.log(response.data);
}

async function signin() {
  console.log("hiees");
  const username = document.getElementById("signin_username").value;
  const password = document.getElementById("signin_password").value;
  console.log(username + password);
  const response = await axios.post("http://localhost:3000/signin", {
    username,
    password,
  });
  console.log(response);
  localStorage.setItem("token", response.data.token);
  console.log(response.data);
  location.reload();
}

async function logout() {
  localStorage.removeItem("token");
  location.reload();
}

async function isloggedin() {
  const token = localStorage.getItem("token");
  console.log(token);
  let logged = false;
  if (token) {
    const response = await axios.get("http://localhost:3000/me", {
      headers: {
        token: token,
      },
    });
    console.log(response);
    if (response.data.username) {
      logged = true;
    } else {
      logged = false;
    }
  }
  if (logged == true) {
    document.getElementById("sign").style.display = "none";
    document.getElementById("todo").style.display = "block";
    render();
  } else if (logged == false) {
    document.getElementById("sign").style.display = "block";
    document.getElementById("todo").style.display = "none";
  }
}

isloggedin();
