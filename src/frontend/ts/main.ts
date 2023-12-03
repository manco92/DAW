var M;
class Main implements EventListenerObject {
  public usuarios: Array<Usuario> = new Array<Usuario>();
  private admin_user: string = "admin";
  private admin_password: string = "123456";
  private backendDatos: any = [];

  private buscarPersonas() {
    for (let u of this.usuarios) {
      console.log(u.mostrar(), this.usuarios.length);
    }
  }

  private buscarDevices() {
    let xmlRequest = new XMLHttpRequest();

    xmlRequest.onreadystatechange = () => {
      if (xmlRequest.readyState == 4) {
        if (xmlRequest.status == 200) {
          console.log(xmlRequest.responseText, xmlRequest.readyState);
          let respuesta = xmlRequest.responseText;
          let datos: Array<Device> = JSON.parse(respuesta);
          this.backendDatos = datos;

          let ul = document.getElementById("listaDisp");

          for (let d of datos) {
            let itemList = ` <li class="collection-item avatar">
                        <img src="./static/images/lightbulb.png" alt="" class="circle">
                        <span class="title">${d.name}</span>
                        <p>
                         ${d.description}
                        </p>
                        <a href="#!" class="secondary-content">
                        <div class="switch">
                        <label>
                          Off
                          <input type="checkbox"`;
            itemList += `nuevoAtt="${d.id}" id="cb_${d.id}"`;
            if (d.state) {
              itemList += ` checked `;
            }

            itemList += `>
                          <span class="lever"></span>
                          On
                        </label>
                      </div>
                        </a>
                        <a href="#modal1" class="waves-effect waves-light btn modal-trigger" id="edit_${d.id}">Editar</a>
                      </li>`;

            ul.innerHTML += itemList;
          }
          for (let d of datos) {
            let checkbox = document.getElementById("cb_" + d.id);
            let editButton = document.getElementById("edit_" + d.id);

            checkbox.addEventListener("click", this);
            editButton.addEventListener("click", this);
          }
        } else {
          console.log("no encontre nada");
        }
      }
    };
    xmlRequest.open("GET", "http://localhost:8000/devices", true);
    xmlRequest.send();
  }

  private ejecutarPost(id: number, state: boolean) {
    let xmlRequest = new XMLHttpRequest();

    xmlRequest.onreadystatechange = () => {
      if (xmlRequest.readyState == 4) {
        if (xmlRequest.status == 200) {
          console.log("llego resputa", xmlRequest.responseText);
        } else {
          alert("Salio mal la consulta");
        }
      }
    };

    xmlRequest.open("POST", "http://localhost:8000/device", true);
    xmlRequest.setRequestHeader("Content-Type", "application/json");
    let s = {
      id: id,
      state: state,
    };
    xmlRequest.send(JSON.stringify(s));
  }

  private cargarUsuario(): void {
    let iNombre = <HTMLInputElement>document.getElementById("iNombre");
    let iPassword = <HTMLInputElement>document.getElementById("iPassword");
    let contentContainer = document.getElementById("contenido");
    let loginContainer = document.getElementById("login");
    let loginErrorContainer = document.getElementById("loginError");

    if (
      iNombre.value === this.admin_user &&
      iPassword.value === this.admin_password
    ) {
      contentContainer.classList.remove("hidden");
      loginContainer.classList.add("hidden");
      this.buscarDevices();
    } else {
      loginErrorContainer.classList.remove("hidden");
    }
  }

  handleEvent(object: Event): void {
    let elemento = <HTMLElement>object.target;

    if ("btnListar" == elemento.id) {
      // this.buscarDevices();
    } else if ("btnGuardar" == elemento.id) {
      this.cargarUsuario();
    } else if (elemento.id.startsWith("cb_")) {
      let checkbox = <HTMLInputElement>elemento;
      console.log(
        checkbox.getAttribute("nuevoAtt"),
        checkbox.checked,
        elemento.id.substring(3, elemento.id.length)
      );

      this.ejecutarPost(
        parseInt(checkbox.getAttribute("nuevoAtt")),
        checkbox.checked
      );
    } else if (elemento.id.startsWith("edit_")) {
      const dispositivo = this.backendDatos.find(
        (d) => d.id === Number(elemento.id.split("_")[1])
      );
      const modalContentContainer = document.getElementById("modalContent");

      modalContentContainer.innerHTML = `
      <div class="input-field">
        <label for="iDeviceName">Nombre</label>
        <input id="iDeviceName" type="text" value="${dispositivo.name}" />
      </div>
      <div class="input-field">
        <label for="iDeviceDescription">Descripción</label>
        <input id="iDeviceDescription" type="text" value="${dispositivo.description}" />
      </div>
      <label>Tipo</label>
      <select class="browser-default" value="${dispositivo.type}">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </select>
      `;
      // modalContent
    }
  }
}

window.addEventListener("load", () => {
  var elems = document.querySelectorAll("select");
  M.FormSelect.init(elems, "");
  var elemsModal = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elemsModal, "");

  let main1: Main = new Main();

  let botonGuardar = document.getElementById("btnGuardar");
  botonGuardar.addEventListener("click", main1);
});
