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

          ul.innerHTML = "";

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
                        <button id="borrarDevice_${d.id}" class="btn">BORRAR</button>
                      </li>`;

            ul.innerHTML += itemList;
          }
          for (let d of datos) {
            let checkbox = document.getElementById("cb_" + d.id);
            let editButton = document.getElementById("edit_" + d.id);
            let botonBorrarDevice = document.getElementById(
              "borrarDevice_" + d.id
            );

            checkbox.addEventListener("click", this);
            editButton.addEventListener("click", this);
            botonBorrarDevice.addEventListener("click", this);
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
          this.buscarDevices();
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

  private ingresarUsuario(): void {
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

  private cerrarSesion(): void {
    let contentContainer = document.getElementById("contenido");
    let loginContainer = document.getElementById("login");
    contentContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
  }

  private editarCambiarDevices(): void {
    const iDeviceID = <HTMLInputElement>document.getElementById("iDeviceID");
    const iDeviceName = <HTMLInputElement>(
      document.getElementById("iDeviceName")
    );
    const iDeviceDescription = <HTMLInputElement>(
      document.getElementById("iDeviceDescription")
    );
    const iDeviceType = <HTMLSelectElement>(
      document.getElementById("iDeviceType")
    );

    let xmlRequest = new XMLHttpRequest();

    xmlRequest.onreadystatechange = () => {
      if (xmlRequest.readyState == 4) {
        if (xmlRequest.status == 200) {
          console.log("llego resputa", xmlRequest.responseText);
          const editModal = document.getElementById("modal1");
          const instance = M.Modal.getInstance(editModal);
          instance.close();
          this.buscarDevices();
        } else {
          alert("Salio mal la consulta");
        }
      }
    };

    xmlRequest.open("POST", "http://localhost:8000/device", true);
    xmlRequest.setRequestHeader("Content-Type", "application/json");
    let deviceState = {
      id: iDeviceID.value,
      name: iDeviceName.value,
      description: iDeviceDescription.value,
      type: iDeviceType.value,
    };

    xmlRequest.send(JSON.stringify(deviceState));
  }

  private addDevice(): void {
    const iAddDeviceName = <HTMLInputElement>(
      document.getElementById("iAddDeviceName")
    );
    const iAddDeviceDescription = <HTMLInputElement>(
      document.getElementById("iAddDeviceDescription")
    );
    const iAddDeviceType = <HTMLSelectElement>(
      document.getElementById("iAddDeviceType")
    );

    let xmlRequest = new XMLHttpRequest();

    xmlRequest.onreadystatechange = () => {
      if (xmlRequest.readyState == 4) {
        if (xmlRequest.status == 200) {
          const addDeviceModal = document.getElementById("modal2");
          const instance = M.Modal.getInstance(addDeviceModal);
          instance.close();
          this.buscarDevices();
          iAddDeviceName.value = "";
          iAddDeviceDescription.value = "";
          iAddDeviceType.value = "";
        } else {
          alert("Salio mal la consulta");
        }
      }
    };

    xmlRequest.open("POST", "http://localhost:8000/device/add", true);
    xmlRequest.setRequestHeader("Content-Type", "application/json");
    let deviceState = {
      name: iAddDeviceName.value,
      description: iAddDeviceDescription.value,
      type: iAddDeviceType.value,
    };

    xmlRequest.send(JSON.stringify(deviceState));
  }

  private borrarDevice(deviceId: string): void {
    console.log({ deviceId });
    let xmlRequest = new XMLHttpRequest();

    xmlRequest.onreadystatechange = () => {
      if (xmlRequest.readyState == 4) {
        if (xmlRequest.status == 200) {
          this.buscarDevices();
        } else {
          alert("Salio mal la consulta");
        }
      }
    };

    xmlRequest.open("DELETE", "http://localhost:8000/device", true);
    xmlRequest.setRequestHeader("Content-Type", "application/json");
    xmlRequest.send(JSON.stringify({ id: deviceId }));
  }

  handleEvent(object: Event): void {
    let elemento = <HTMLElement>object.target;

    if ("btnListar" == elemento.id) {
      // this.buscarDevices();
    } else if ("btnIngresar" == elemento.id) {
      this.ingresarUsuario();
    } else if ("logoutButton" == elemento.id) {
      this.cerrarSesion();
    } else if ("editarDevicesButton" == elemento.id) {
      this.editarCambiarDevices();
    } else if ("addDevicesButton" == elemento.id) {
      this.addDevice();
    } else if (elemento.id.startsWith("borrarDevice_")) {
      const deviceId = elemento.id.split("_")[1];
      this.borrarDevice(deviceId);
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
      <input id="iDeviceID" type="text" style="display: none;" value="${dispositivo.id}" />
      <div class="input-field">
        <label for="iDeviceName">Nombre</label>
        <input id="iDeviceName" type="text" value="${dispositivo.name}" />
      </div>
      <div class="input-field">
        <label for="iDeviceDescription">Descripción</label>
        <input id="iDeviceDescription" type="text" value="${dispositivo.description}" />
      </div>
      <label>Tipo</label>
      <select id="iDeviceType" class="browser-default" value="${dispositivo.type}">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </select>
      <div style="margin-top: 15px">
      <button id="editarDevicesButton" class="btn">OK</button>
      </div>
      `;
      // modalContent
      let botonEditarDevices = document.getElementById("editarDevicesButton");
      botonEditarDevices.addEventListener("click", this);
    }
  }
}

window.addEventListener("load", () => {
  var elems = document.querySelectorAll("select");
  M.FormSelect.init(elems, "");
  var elemsModal = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elemsModal, "");

  let main1: Main = new Main();

  let botonGuardar = document.getElementById("btnIngresar");
  let botonLogout = document.getElementById("logoutButton");
  let botonAddDevice = document.getElementById("addDevicesButton");

  botonGuardar.addEventListener("click", main1);
  botonLogout.addEventListener("click", main1);
  botonAddDevice.addEventListener("click", main1);
});
