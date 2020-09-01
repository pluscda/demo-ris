import Swal from "sweetalert2";
import {
  WebApiAdaptor
} from "@syncfusion/ej2-data";
import store from "../store";
import * as configs from "@/config";

WebApiAdaptor.prototype.beforeSend = function (dm, request) {
  request.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
  var token = store.state.Profile4User[configs.JWTTokenName];
  if (token) {
    request.setRequestHeader("Authorization", "Bearer " + token);
  }
};

export default class Common {
  static actionFailure(args) {
    if (args.error != null) {
      if (args.error.length > 0) {
        let error = args.error[0].error;
        Swal.fire(error.status === 409 ? "驗證錯誤！" : "伺服器錯誤！", error.response, "error");
      } else if (args.error.error.constructor === XMLHttpRequest)
        Swal.fire("伺服器錯誤！", args.error.error.response, "error");
    } else if (args.length > 0) {
      let error = args[0].error;
      Swal.fire(error.status === 409 ? "驗證錯誤！" : "伺服器錯誤！", error.response, "error");
    }
  }
  static openWindow(verb, url, data) {
    var form = document.createElement("form");
    form.action = url;
    form.method = verb;
    form.target = "_blank";
    if (data) {
      for (var key in data) {
        var input = document.createElement("input");
        input.name = key;
        input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
        form.appendChild(input);
      }
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
}