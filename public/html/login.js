function login(){
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value

    const xhr = new XMLHttpRequest()

    xhr.onload = function () {
        if (xhr.status === 201) {
            let err = xhr.responseText
            let span = document.getElementById("msg")
            span.innerText = err
            span.setAttribute("color","red")
        }
        if (xhr.status === 200){
            window.location.href = "./shop.html";
        }   
    }

    const url = new URL("/login", "http://localhost:3000")
    if(username != null && password != null){
      let params = {username : username, password : password}

      xhr.open("POST", url)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(JSON.stringify(params))
    }
}

function register(){
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    const xhr = new XMLHttpRequest()

    xhr.onload = function () {
        if (xhr.status === 400) {
            let err = xhr.responseText
            let span = document.getElementById("msg")
            span.innerText = err
        }
        if (xhr.status === 201){
            let msg = xhr.responseText
            let span = document.getElementById("msg")
            span.innerText = msg
        }

    }

    const url = new URL("/register", "http://localhost:3000")
    if(username != null && password != null){
      let params = {username : username, password : password}

      xhr.open("POST", url)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(JSON.stringify(params))
    }
}