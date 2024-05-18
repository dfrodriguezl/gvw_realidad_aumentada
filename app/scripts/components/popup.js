import React from "react";
import alertify from "alertifyjs";
import ReactDOM from 'react-dom';
import { servidorPost, getIpClient, servidorPostRaw } from '../base/request';
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

// import "alertifyjs/build/css/alertify.css";
// import "alertifyjs/build/css/themes/semantic.css";
import { variables } from '../base/variables';

const Popup = () => {

  var logosDiv = '<div className="login__container__bottom"><p className="login__container__bottom__description">Powered by</p><div className="login__container__bottom__iconGeoportal"><span className="DANE__Geovisor__icon__logoGeoportal02"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span><span className="path11"></span><span className="path12"></span><span className="path13"></span><span className="path14"></span><span className="path15"></span><span className="path16"></span></span></div><div className="login__container__bottom__iconDANE"><span className="DANE__Geovisor__icon__logoDANE__02"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span><span className="path11"></span><span className="path12"></span><span className="path13"></span><span className="path14"></span><span className="path15"></span><span className="path16"></span><span className="path17"></span><span className="path18"></span><span className="path19"></span><span className="path20"></span><span className="path21"></span><span className="path22"></span><span className="path23"></span><span className="path24"></span></span></div></div>';

  const handleSimpleMessage = () => {
    // default notification
    // Shorthand for:
    // alertify.notify( message, [type, wait, callback]);
    alertify.message("Normal message");
  }


  const handleSuccess = () => {
    let a = document.getElementById("usuario");
    let b = document.getElementById("password");
    // console.log(variables.codVisor);
    // console.log(variables.captcha);

    if ((a.value).length === 0 || b.length === 0) {
      alertify.error("Por favor ingresar el nombre de usuario o contraseña");
    } else if (variables.captcha == null) {
      alertify.error("Por favor validar captcha");
    } else {
      // let c = getIpClient();
      // console.log(c);
      let query = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/login.php";
      let user = {
        usuario: a.value,
        clave: b.value,
        visor: variables.codVisor,
      };
      const data = JSON.stringify(user);
      const options = {
        headers: { "content-type": "application/json" }
      }
      axios.post(query, data, options).then(resp => {
        // console.log(a.value, b.value);
        if (resp.data.token === undefined) {
          alertify.error("El nombre de usuario o contraseña es incorrecto");
          a.value = "";
          b.value = "";
        } else {
          localStorage.setItem('token', resp.data.token);
          location.reload(true);
        }
      });
    }
  }

  const handleError = () => {
    // error notification
    // Shorthand for:
    // alertify.notify( message, 'error', [wait, callback]);
    alertify.error("Error message");
  }

  const handleWarning = () => {
    // warning notification
    // Shorthand for:
    // alertify.notify( message, 'warning', [wait, callback]);
    alertify.warning("Warning message");
  }

  const handleAlertBoxClick = () => {
    alertify.alert("Custom Heading", "This is an alert dialog.", function () {
      // Optional side effect
      alertify.message("OK");
    });
  }

  const handleOkCancelConfirmation = () => {
    alertify.confirm(
      "Custom Heading",
      "This is a confirm dialog.",
      function () {
        alertify.success("Ok");
      },
      function () {
        alertify.error("Cancel");
      }
    );
  }

  const handlePrompt = () => {
    alertify.prompt(
      "Custom Heading",
      "This is a prompt dialog.",
      "Default value",
      function (evt, value) {
        alertify.success("Ok: " + value);
      },
      function () {
        alertify.error("Cancel");
      }
    );
  }

  alertify.dialog('genericDialog', function () {
    var input = document.createElement('INPUT');
    input.id += "usuario";
    var p = document.createElement('P');
    var inputDos = document.createElement('INPUT');
    inputDos.id += "password";
    var pDos = document.createElement('P');
    var iniciarTres = document.createElement('DIV');
    iniciarTres.id += "captcha";
    var iniciar = document.createElement('BUTTON');
    iniciar.className += "botonsesion";
    iniciar.innerHTML = "Iniciar Sesión";
    var logos = document.createElement('DIV');
    logos.id += "logo";
    logos.innerHTML = logosDiv;
    iniciar.addEventListener('click', handleSuccess, false);
    return {
      main: function (_title, _message, _value, _messageDos, _valueDos, _onok, _oncancel) {
        // console.log(_title, _message, _value,_messageDos, _valueDos, _onok, _oncancel);
        // console.log(arguments.length);
        var title, message, value, messageDos, valueDos, onok, oncancel;
        switch (arguments.length) {
          case 1:
            message = _title;
            break;
          case 2:
            message = _title;
            value = _message;
            break;
          case 3:
            message = _title;
            value = _message;
            onok = _value;
            break;
          case 4:
            message = _title;
            value = _message;
            onok = _value;
            oncancel = _onok;
            break;
          case 5:
            title = _title;
            message = _message;
            value = _value;
            onok = _onok;
            oncancel = _oncancel;
            break;
          case 7:
            title = _title;
            message = _message;
            value = _value;
            messageDos = _messageDos;
            valueDos = _valueDos;
            onok = _onok;
            oncancel = _oncancel;
            break;
        }
        this.set('title', title);
        this.set('message', message);
        this.set('value', value);
        this.set('messageDos', messageDos);
        this.set('valueDos', valueDos);
        this.set('onok', onok);
        this.set('oncancel', oncancel);
        return this;
      },
      setup: function () {
        return {
          buttons: [
          ],
          focus: {
            element: input,
            select: true
          },
          options: {
            maximizable: false,
            resizable: false
          }
        };
      },
      build: function () {
        console.log(this.get('title'));
        input.className = alertify.defaults.theme.input;
        input.setAttribute('type', 'text');
        this.elements.content.appendChild(p);
        this.elements.content.appendChild(input);
        inputDos.className = alertify.defaults.theme.input;
        inputDos.setAttribute('type', 'password');
        this.elements.content.appendChild(pDos);
        this.elements.content.appendChild(inputDos);
        this.elements.footer.appendChild(iniciarTres);
        this.elements.footer.appendChild(iniciar);
        this.elements.footer.appendChild(logos);
      },
      prepare: function () {
        //nothing
      },
      setMessage: function (message) {
        if (typeof message === 'string') {
          // clearContents(p);
          p.innerHTML = message;
        } else if (message instanceof window.HTMLElement && p.firstChild !== message) {
          // clearContents(p);
          p.appendChild(message);
        }
      },
      setMessageDos: function (messageDos) {
        if (typeof messageDos === 'string') {
          // clearContents(p);
          pDos.innerHTML = messageDos;
        } else if (messageDos instanceof window.HTMLElement && pDos.firstChild !== messageDos) {
          // clearContents(p);
          pDos.appendChild(messageDos);
        }
      },
      settings: {
        message: undefined,
        messageDos: undefined,
        labels: undefined,
        onok: undefined,
        oncancel: undefined,
        value: '',
        valueDos: '',
        type: 'text',
        reverseButtons: undefined,
      },
      settingUpdated: function (key, oldValue, newValue) {
        console.log(key, oldValue, newValue);
        switch (key) {
          case 'message':
            this.setMessage(newValue);
            break;
          case 'value':
            input.setAttribute('placeholder', newValue);
            // input.value = newValue;
            break;
          case 'messageDos':
            this.setMessageDos(newValue);
            break;
          case 'valueDos':
            inputDos.setAttribute('placeholder', newValue);
            // input.valueDos = newValue;
            break;
          case 'type':
            switch (newValue) {
              case 'text':
              case 'color':
              case 'date':
              case 'datetime-local':
              case 'email':
              case 'month':
              case 'number':
              case 'password':
              case 'search':
              case 'tel':
              case 'time':
              case 'week':
                input.type = newValue;
                break;
              default:
                input.type = 'text';
                break;
            }
            break;
          case 'labels':
            if (newValue.ok && this.__internal.buttons[0].element) {
              this.__internal.buttons[0].element.innerHTML = newValue.ok;
            }
            if (newValue.cancel && this.__internal.buttons[1].element) {
              this.__internal.buttons[1].element.innerHTML = newValue.cancel;
            }
            break;
          case 'reverseButtons':
            if (newValue === true) {
              this.elements.buttons.primary.appendChild(this.__internal.buttons[0].element);
            } else {
              this.elements.buttons.primary.appendChild(this.__internal.buttons[1].element);
            }
            break;
        }
      },
      callback: function (closeEvent) {
        console.log(closeEvent);
        // var returnValue;
        // switch (closeEvent.index) {
        // case 0:
        //     console.log(input.value +" - "+ input.valueDos);
        //     this.settings.value = input.value;
        //     if (typeof this.get('onok') === 'function') {

        //         returnValue = this.get('onok').call(this, closeEvent, this.settings.value);
        //         if (typeof returnValue !== 'undefined') {
        //             closeEvent.cancel = !returnValue;
        //         }
        //     }
        //     break;
        // case 1:
        //     if (typeof this.get('oncancel') === 'function') {
        //         returnValue = this.get('oncancel').call(this, closeEvent);
        //         if (typeof returnValue !== 'undefined') {
        //             closeEvent.cancel = !returnValue;
        //         }
        //     }
        //     if(!closeEvent.cancel){
        //         input.value = this.settings.value;
        //     }
        //     break;
        // }
      }
    };
  });

  const handleGenericDialog = () => {
    alertify.genericDialog(
      "Ingreso de Usuarios",
      "Usuario",
      "usuario@dane.gov.co",
      "Contraseña",
      "Su clave de acceso",
      function (evt, value) {
        // alertify.success("Ok: " + value);
        console.log(evt, value);
      },
      function () {
        alertify.error("Cancel");
      }
    ).set({ 'closable': false, 'movable': false, 'moveBounded': false });
  }

  // handleGenericDialog();
  // ReactDOM.render(<ReCAPTCHA
  //   sitekey="6LfORYsfAAAAAL3on9Er4RhSToHbJuqhTbyhFXDE"
  //   onChange={onChange}
  // />, document.getElementById('captcha'));

  function onChange(value) {
    // console.log("Captcha value:", value);
    variables.captcha = value;
  }

  return (
    <div className="alertify  ajs-pinnable ajs-pulse">
      <div className="ajs-dimmer"></div>
      <div className="ajs-modal">
        <div className="login__container__top">
          <div className="login__container__top__iconLogin --backgroundMagentaTransparency">
            <span className=" DANE__Geovisor__icon__user"></span>
          </div>
          <h2 className="login__container__top__name">Ingreso exclusivo de Usuarios autorizados del DANE</h2>
        </div>
        <div className="ajs-dialog">
          <div className="ajs-body">
            <div className="ajs-content">
              <p>Usuario</p>
              {/* <input id="usuario" className="ajs-input" type="text" placeholder="usuario@dane.gov.co" /> */}
              <input placeholder="usuario@dane.gov.co" className="login__container__formContainer__form__inputContainer__input" id="usuario" />
              <p>Contraseña</p>
              {/* <input id="password" className="ajs-input" type="password" placeholder="Su clave de acceso" /> */}
              <input placeholder="******" type="password" className="login__container__formContainer__form__inputContainer__input" id="password" />
            </div>
          </div>
          <div className="ajs-footer">
            <div id="captcha">
              <ReCAPTCHA
                sitekey="6Le2UuofAAAAAEoO9y_2Mlr2UtqhLFOpzqXz7jdt"
                onChange={onChange}
              />
              {/* <button className="botonsesion">Iniciar Sesión</button> */}
              <button type="submit" className="login__container__formContainer__form__buttonContainer__submitButton botonsesion" onClick={handleSuccess}>Iniciar Sesión</button>
            </div>
            <div id="logo">
              <div className="login__container__bottom">
                <p className="login__container__bottom__description">Powered by</p>
                <div className="login__container__bottom__iconGeoportal">
                  <span className="DANE__Geovisor__icon__logoGeoportal02">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                    <span className="path5"></span>
                    <span className="path6"></span>
                    <span className="path7"></span>
                    <span className="path8"></span>
                    <span className="path9"></span>
                    <span className="path10"></span>
                    <span className="path11"></span>
                    <span className="path12"></span>
                    <span className="path13"></span>
                    <span className="path14"></span>
                    <span className="path15"></span>
                    <span className="path16"></span>
                  </span>
                </div>
                <div className="login__container__bottom__iconDANE">
                  <span className="DANE__Geovisor__icon__logoDANE__02">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                    <span className="path5"></span>
                    <span className="path6"></span>
                    <span className="path7"></span>
                    <span className="path8"></span>
                    <span className="path9"></span>
                    <span className="path10"></span>
                    <span className="path11"></span>
                    <span className="path12"></span>
                    <span className="path13"></span>
                    <span className="path14"></span>
                    <span className="path15"></span>
                    <span className="path16"></span>
                    <span className="path17"></span>
                    <span className="path18"></span>
                    <span className="path19"></span>
                    <span className="path20"></span>
                    <span className="path21"></span>
                    <span className="path22"></span>
                    <span className="path23"></span>
                    <span className="path24"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Popup;