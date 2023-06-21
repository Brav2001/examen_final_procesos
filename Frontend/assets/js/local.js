//funciones propias de la app
const urlApi = "http://localhost:3000";//colocar la url con el puerto

async function login() {
    var myForm = document.getElementById("loginForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) {//convertimos los datos a json
        jsonData[k] = v;
    }
    var settings = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }
    const request = await fetch(urlApi + "/auth/login", settings);
    //console.log(await request.text());
    if (request.ok) {
        const respuesta = await request.json();
        localStorage.token = "Bearer " + respuesta.data.token;

        //localStorage.token = respuesta;
        localStorage.email = jsonData.email;
        location.href = "dashboard.html";
    }
}

function listar() {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/user", settings)
        .then(response => response.json())
        .then((response) => {

            var usuarios = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5 fw-bold"><i class="fa-solid fa-list"></i> LISTADO DE USUARIOS</h1>
            </div>
            
            <a href="#" onclick="userRegister()" class="btn btn-outline-success"><i class="fa-solid fa-user-plus"></i></a>
            <table class="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody id="listaBody"></tbody>
            </table>
            `;
            document.getElementById("lista").innerHTML = usuarios;
            datos = '';
            for (const usuario of response.data) {
                fetch(urlApi + "/carsUser", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.token
                    },
                    body: JSON.stringify({
                        id: usuario.id
                    }),
                })
                    .then(res => res.json())
                    .then((res) => {
                        datos += `
                    <tr>
                        <th scope="row">${usuario.id}</th>
                        <td>${usuario.firstName}</td>
                        <td>${usuario.lastName}</td>
                        <td>${usuario.email}</td>
                        <td>
                        <a href="#" onclick="verModificarUsuario('${usuario.id}')" class="btn btn-outline-warning">
                            <i class="fa-solid fa-user-pen"></i>
                        </a>
                        <a href="#" onclick="verUsuario('${usuario.id}')" class="btn btn-outline-info">
                            <i class="fa-solid fa-eye"></i>
                        </a>

                        ${res.data ? `
                        <a href="#"  onclick="verPropiedad('${usuario.id}')" class="btn btn-outline-success cyan">
                            <i class="fa-solid fa-id-card"></i>
                        </a>`
                                : `<a href="#"   class="btn btn-outline-danger" disabled>
                            <i class="fa-solid fa-ticket"></i>
                            </a>`
                            }

                        </td>
                    </tr>`;
                        document.getElementById("listaBody").innerHTML = datos;
                    })



            }

        })
}

function verPropiedad(id) {

    validaToken();

    fetch(urlApi + "/carsUser", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify({
            id: id
        }),
    })
        .then(response => response.json())
        .then((response) => {
            usuario = response.data;
            var cadena = '';
            if (usuario) {
                cadena = `
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Gestion de Propiedad</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" >
                    <div class="p-3 mb-2 bg-light text-dark">
                        <h1 class="display-5"><i class="fa-solid fa-id-card"></i> Visualizar Propiedad</h1>
                    </div>
                    <div id="listaPropiedad"></div>
                    
                </div>`;
                document.getElementById("contentModal").innerHTML = cadena;
                datos = '';
                for (const data of usuario) {
                    datos += `
                    <!-- Tarjeta -->
                    <style>
                
                /* ---------- Estilos Generales de las Tarjetas ----------*/
                .tarjeta {
                    width: 100%;
                    max-width: 550px;
                    position: relative;
                    color: #fff;
                    transition: .3s ease all;
                    transform: rotateY(0deg);
                    transform-style: preserve-3d;
                    cursor: pointer;
                    z-index: 2;
                }
                
                .tarjeta.active {
                    transform: rotateY(180deg);
                }
                
                .tarjeta > div {
                    padding: 30px;
                    border-radius: 15px;
                    min-height: 315px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    box-shadow: 0 10px 10px 0 rgba(90,116,148,0.3);
                }
                
                /* ---------- Tarjeta Delantera ----------*/
                
                .tarjeta .delantera {
                    width: 100%;
                    background: url(assets/img/bg-tarjeta/bg-tarjeta-03.jpg);
                    background-size: cover;
                }
                
                .delantera .logo-marca {
                    text-align: right;
                    min-height: 50px;
                }
                
                .delantera .logo-marca img {
                    width: 50%;
                    height: 50%;
                    text-align: right;
                    object-fit: cover;
                    max-width: 80px;
                }

                .delantera .logo-marca-1 {
                    text-align: left;
                    min-height: 50px;
                }
                
                .delantera .logo-marca-1 img {
                    width: 50%;
                    height: 50%;
                    object-fit: cover;
                    max-width: 80px;
                }
                
                .delantera .chip {
                    width: 100%;
                    max-width: 50px;
                    margin-bottom: 20px;
                }
                
                .delantera .grupo .label {
                    font-size: 16px;
                    color: #7d8994;
                    margin-bottom: 5px;
                }

                .delantera .numero2{
                    color: #fff;
                    font-size: 12px;
                    text-align: center;
                    text-transform: uppercase;
                }
                
                .delantera .grupo .numero,
                .delantera .grupo .nombre,
                .delantera .grupo .expiracion {
                    color: #fff;
                    font-size: 22px;
                    text-transform: uppercase;
                }
                
                .delantera .flexbox {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
                
                /* ---------- Tarjeta Trasera ----------*/
                .trasera {
                    background: url(assets/img/bg-tarjeta/bg-tarjeta-02.jpg);
                    background-size: cover;
                    position: absolute;
                    top: 0;
                    transform: rotateY(180deg);
                    backface-visibility: hidden;
                }
                
                .trasera .barra-magnetica {
                    height: 40px;
                    background: #000;
                    width: 100%;
                    position: absolute;
                    top: 30px;
                    left: 0;
                }
                
                .trasera .datos {
                    margin-top: 60px;
                    display: flex;
                    justify-content: space-between;
                }
                
                .trasera .datos p {
                    margin-bottom: 5px;
                }
                
                .trasera .datos #firma {
                    width: 70%;
                }
                
                .trasera .datos #firma .firma {
                    height: 40px;
                    background: repeating-linear-gradient(skyblue 0, skyblue 5px, orange 5px, orange 10px);
                }
                
                .trasera .datos #firma .firma p {
                    line-height: 40px;
                    font-family: 'Liu Jian Mao Cao', cursive;
                    color: #000;
                    font-size: 30px;
                    padding: 0 10px;
                    text-transform: capitalize;
                }
                
                .trasera .datos #ccv {
                    width: 20%;
                }
                
                .trasera .datos #ccv .ccv {
                    background: #fff;
                    height: 40px;
                    color: #000;
                    padding: 10px;
                    text-align: center;
                }
                
                .trasera .leyenda {
                    font-size: 14px;
                    line-height: 24px;
                }
                
                .trasera .link-banco {
                    font-size: 14px;
                    color: #fff;
                }
                      </style>
          
                      <!-- Tarjeta -->
                      <section class="tarjeta" id="tarjeta" >
                          <div class="delantera">
                          <div class="flexbox">
                          <div class="logo-marca-1 " id="logo-marca-1">
                                  <img src="assets/img/icon-1.png" alt="">
                              </div>
                              <div>
                              <h5>REPÚBLICA DE COLOMBIA</h5>
                              <p class="numero2">MINISTERIO DE TRANSPORTE</p>
                              </div>
                              <div class="logo-marca" id="logo-marca">
                                  <img src="assets/img/icon-2.png" alt=""> 
                              </div>
                              </div>
                              <div class="datos">
                              <div class="flexbox">
                                  <div class="grupo" id="numero">
                                      <p class="label">PLACA</p>
                                      <p class="numero"> ${data.carsId.car_vin}</p>
                                  </div>
                                  <div class="grupo" id="numero">
                                      <p class="label">MARCA</p>
                                      <p class="numero"> ${data.carsId.car}</p>
                                  </div>
                                  </div>
                                  <div class="flexbox">
                                      <div class="grupo" id="nombre">
                                          <p class="label">PROPIETARIO</p>
                                          <p class="nombre"> ${data.userId.firstName} ${data.userId.lastName}</p>
                                      </div>
              
                                      <div class="grupo" id="expiracion">
                                          <p class="label">MODELO</p>
                                          <p class="expiracion">${data.carsId.car_model}</p>
                                      </div>
                                      <div class="grupo" id="expiracion">
                                          <p class="label">COLOR</p>
                                          <p class="expiracion">${data.carsId.car_color}</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
              
                          <div class="trasera">
                              <div class="barra-magnetica"></div>
                              <div class="datos">
                                  <div class="grupo" id="firma">
                                      <p class="label">Firma</p>
                                      <div class="firma"><p></p></div>
                                  </div>
                                  <div class="grupo" id="ccv">
                                      <p class="label">CCV</p>
                                      <p class="ccv"></p>
                                  </div>
                              </div>
                              <p class="leyenda">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus exercitationem, voluptates illo.</p>
                              <a href="#" class="link-banco">www.tubanco.com</a>
                          </div>
                      </section>
                    <br>
                    `;

                    document.getElementById("listaPropiedad").innerHTML = datos;
                }




            }

            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
        })

}

function listarCarros() {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/cars", settings)
        .then(response => response.json())
        .then((response) => {

            let carros = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5 fw-bold"><i class="fa-solid fa-list"></i> LISTADO DE CARROS</h1>
            </div>
            
            <table class="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Marca</th>
                    <th scope="col">Modelo</th>
                    <th scope="col">Color</th>
                    <th scope="col">Año</th>
                    <th scope="col">Placa</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Accion</th>
                </tr>
                </thead>
                <tbody>
            `;
            for (const carro of response) {
                carros += `
                <tr>
                    <th scope="row">${carro.id}</th>
                    <td>${carro.car}</td>
                    <td>${carro.car_model}</td>
                    <td>${carro.car_color}</td>
                    <td>${carro.car_model_year}</td>
                    <td>${carro.car_vin}</td>
                    <td>${carro.price}</td>

                    <td>
                    <a href="#" onclick="verModificarCarro('${carro.id}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-edit"></i>
                    </a>
                    <a href="#" onclick="verCarro('${carro.id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>

                    ${carro.availability ? `
                        <a href="#" onclick="verVenderCarro('${carro.id}')" class="btn btn-outline-success cyan">
                            <i class="fa-solid fa-ticket"></i>
                        </a>`
                        : `<a href="#"  onclick="CarroNoDisponible()" class="btn btn-outline-danger" disabled>
                            <i class="fa-solid fa-ticket"></i>
                            </a>`
                    }
                    
                    </td>
                </tr>`;

            }
            carros += `</tbody>
            </table>`
            document.getElementById("lista").innerHTML = carros;
        })
}

function verVenderCarro(id) {
    validaToken();
    var cadena = '';
    if (id) {
        cadena = `
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Gestion de Ventas</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" >
        <div class="p-3 mb-2 bg-light text-dark">
            <h1 class="display-5"><i class="fa-solid fa-cart-plus"></i> Vender Carro</h1>
        </div>
        
        <form action="" method="post" id="updatedForm">
            <input type="hidden" name="Carid" id="id" value="${id}">

            <label for="email" class="form-label">Comprador</label>
            <input type="email" class="form-control" name="email" id="emailComprador" required ><br>

            <button type="button" class="btn btn-outline-primary" 
                onclick="venderCarro('${id}')">Vender
            </button>
        </form>
        </div>`;
    }
    document.getElementById("contentModal").innerHTML = cadena;
    var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
    myModal.toggle();

}

function venderCarro(id) {
    validaToken();
    var email = document.getElementById("emailComprador").value;

    fetch(urlApi + "/user/email/" + email, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    })
        .then(response => response.json())
        .then((response) => {
            if (response.data.id) {
                fetch(urlApi + "/saveCarsUser", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.token
                    },
                    body: JSON.stringify({
                        carsId: {
                            id: id
                        },
                        userId: {
                            id: response.data.id
                        }
                    }),
                })
                    .then(response => response.json())
                    .then((response) => {
                        if (response.status == 201) {
                            fetch(urlApi + "/updateCarAvailability/" + id, {
                                method: 'PUT',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': localStorage.token
                                },
                            }).then(response => response.json())
                                .then((response) => {
                                    if (response.status == 200) {
                                        alertas("Carro vendido correctamente!", 1);
                                        document.getElementById("contentModal").innerHTML = '';
                                        var myModalEl = document.getElementById('modalUsuario')
                                        var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
                                        modal.hide();
                                        listarCarros();
                                    } else {
                                        alertas("Ocurrio un error!", 0);
                                        document.getElementById("contentModal").innerHTML = '';
                                        var myModalEl = document.getElementById('modalUsuario')
                                        var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
                                        modal.hide();
                                    }
                                })
                        } else {
                            alertas("Ocurrio un error!", 0);
                            document.getElementById("contentModal").innerHTML = '';
                            var myModalEl = document.getElementById('modalUsuario')
                            var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
                            modal.hide();
                        }
                    })
            } else {
                alertas("El email no existe!", 0);
                document.getElementById("contentModal").innerHTML = '';
                var myModalEl = document.getElementById('modalUsuario')
                var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
                modal.hide();
            }
        });

    listarCarros();



}

function CarroNoDisponible() {
    alertas("Este Carro no esta disponible para la venta!", 0);
}

function verCarro(id) {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/cars/" + id, settings)
        .then(response => response.json())
        .then((carro) => {
            var cadcarro
            if (carro) {
                cadena = `
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Gestion de carros</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" >
                    <div class="p-3 mb-2 bg-light text-dark">
                        <h1 class="display-5"><i class="fa-solid fa-car"></i> Visualizar Carro</h1>
                    </div>
                    <ul class="list-group">
                        <li class="list-group-item">Marca: ${carro.car}</li>
                        <li class="list-group-item">Modelo: ${carro.car_model}</li>
                        <li class="list-group-item">Color: ${carro.car_color}</li>
                        <li class="list-group-item">Año: ${carro.car_model_year}</li>
                        <li class="list-group-item">Placa: ${carro.car_vin}</li>
                        <li class="list-group-item">Precio: ${carro.price}</li>
                    </ul>
                </div>`;



            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
        })
}

function verModificarCarro(id) {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/cars/" + id, settings)
        .then(response => response.json())
        .then((carro) => {
            var cadena = '';
            if (carro) {
                cadena = `
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Gestion de Carros</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" >
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-car"></i> Modificar Carro</h1>
                </div>
              
                <form action="" method="post" id="updatedForm">
                    <input type="hidden" name="id" id="id" value="${carro.id}">

                    <label for="car" class="form-label">Marca</label>
                    <input type="text" class="form-control" name="car" id="car" required value="${carro.car}"> <br>

                    <label for="car_model"  class="form-label">Modelo</label>
                    <input type="text" class="form-control" name="car_model" id="car_model" required value="${carro.car_model}"> <br>

                    <label for="car_color" class="form-label">Color</label>
                    <input type="text" class="form-control" name="car_color" id="car_color" required value="${carro.car_color}"> <br>

                    <label for="car_model_year" class="form-label">Año</label>
                    <input type="text" class="form-control" id="car_model_year" name="car_model_year" required value="${carro.car_model_year}"> 

                    <label for="car_vin" class="form-label">Placa</label>
                    <input type="text" class="form-control" id="car_vin" name="car_vin" required value="${carro.car_vin}"> 

                    <label for="price" class="form-label">Precio</label>
                    <input type="text" class="form-control" id="price" name="price" required value="${carro.price}">
                    
                    <label for="availability" class="form-label" ${carro.availability ? null : 'hidden'}>Availability</label>
                    <select id="availability" name="availability" class="form-select" aria-label="Default select example" ${carro.availability ? null : 'hidden'}>
                        <option ${carro.availability ? 'selected' : null} value="true">Disponible</option>
                        <option ${carro.availability ? null : 'selected'} value="false">No Disponible</option>
                    </select>

                    <br>

                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarCarro('${carro.id}')">Modificar
                    </button>
                </form>
                </div>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
        })
}

async function modificarCarro(id) {
    validaToken();
    var myForm = document.getElementById("updatedForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) {//convertimos los datos a json
        jsonData[k] = v;
    }
    await fetch(urlApi + "/updateCar/" + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listarCarros();
    alertas("Se ha modificado el carro exitosamente!", 1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function eliminaUsuario(id) {
    validaToken();
    var settings = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/api/users/" + id, settings)
        .then(response => response.json())
        .then(function (data) {
            listar();
            alertas("Se ha eliminado el usuario exitosamente!", 2)
        })
}

function verModificarUsuario(id) {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/user/" + id, settings)
        .then(response => response.json())
        .then((response) => {
            var cadena = '';
            usuario = response.data;
            if (usuario) {
                cadena = `
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Gestion de usuarios</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" >
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Usuario</h1>
                </div>
              
                <form action="" method="post" id="updatedForm">
                    <input type="hidden" name="id" id="id" value="${usuario.id}">
                    <label for="firstName" class="form-label">First Name</label>
                    <input type="text" class="form-control" name="firstName" id="firstName" required value="${usuario.firstName}"> <br>
                    <label for="lastName"  class="form-label">Last Name</label>
                    <input type="text" class="form-control" name="lastName" id="lastName" required value="${usuario.lastName}"> <br>
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" name="email" id="email" required value="${usuario.email}"> <br>
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" name="password" required> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarUsuario('${usuario.id}')">Modificar
                    </button>
                </form>
                </div>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
        })
}

async function modificarUsuario(id) {
    validaToken();
    var myForm = document.getElementById("updatedForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) {//convertimos los datos a json
        jsonData[k] = v;
    }
    await fetch(urlApi + "/user/" + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listar();
    alertas("Se ha modificado el usuario exitosamente!", 1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function verUsuario(id) {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/user/" + id, settings)
        .then(response => response.json())
        .then((response) => {
            usuario = response.data;
            var cadena = '';
            if (usuario) {
                cadena = `
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Gestion de usuarios</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" >
                    <div class="p-3 mb-2 bg-light text-dark">
                        <h1 class="display-5"><i class="fa-solid fa-user"></i> Visualizar Usuario</h1>
                    </div>
                    <ul class="list-group">
                        <li class="list-group-item">Nombre: ${usuario.firstName}</li>
                        <li class="list-group-item">Apellido: ${usuario.lastName}</li>
                        <li class="list-group-item">Correo: ${usuario.email}</li>
                    </ul>
                </div>`;

            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
        })
}

function alertas(mensaje, tipo) {
    var color = "";
    if (tipo == 1) {//success verde
        color = "success"
    }
    else {//danger rojo
        color = "danger"
    }
    var alerta = `<div class="alert alert-${color} alert-dismissible fade show" role="alert">
                    <strong><i class="fa-solid fa-triangle-exclamation"></i></strong>
                        ${mensaje}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                 </div>`;
    document.getElementById("datos").innerHTML = alerta;
}

function userRegister() {
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Registrar Usuario</h1>
            </div>
              
            <form action="" method="post" id="myFormRegister">
                <input type="hidden" name="id" id="id">
                <label for="firstName" class="form-label">First Name</label>
                <input type="text" class="form-control" name="firstName" id="firstName" required> <br>
                <label for="lastName"  class="form-label">Last Name</label>
                <input type="text" class="form-control" name="lastName" id="lastName" required> <br>
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" name="email" id="email" required> <br>
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="registrarUsuario()">Registrar</button>
            </form>`;
    document.getElementById("contentModal").innerHTML = cadena;
    var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
    myModal.toggle();
}

async function registrarUsuario() {
    var myForm = document.getElementById("myFormRegister");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) {//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi + "/user", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    });
    listar();
    alertas("Se ha registrado el usuario exitosamente!", 1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function modalConfirmacion(texto, funcion) {
    document.getElementById("contenidoConfirmacion").innerHTML = texto;
    var myModal = new bootstrap.Modal(document.getElementById('modalConfirmacion'))
    myModal.toggle();
    var confirmar = document.getElementById("confirmar");
    confirmar.onclick = funcion;
}

function salir() {
    localStorage.clear();
    location.href = "index.html";
}

function validaToken() {
    if (localStorage.token == undefined) {
        salir();
    }
}

function voltear() {
    const tarjeta = document.querySelector('#tarjeta');

    // * Volteamos la tarjeta para mostrar el frente.
    const mostrarFrente = () => {
        if (tarjeta.classList.contains('active')) {
            tarjeta.classList.remove('active');
        }
    }

    // * Rotacion de la tarjeta
    tarjeta.addEventListener('click', () => {
        tarjeta.classList.toggle('active');
    });
}