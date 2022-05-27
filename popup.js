import $ from "jquery";
const queryString = require("query-string");
const mainTool = require("./helper/index.js");

let url;
let importantCookie;
let apiKey;
let studentId;
let parsed;
let haveCourse = false;

// chrome.runtime.onMessage.addListener((url) => {
//   console.log("popup", url);
//   const location = new URL(url);
//   parsed = queryString.parse(location.search);
//   console.log(parsed);
// });

(async function initPopupWindow() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    try {
      url = new URL(tab.url);
      let domain = url.hostname;
      parsed = queryString.parse(url.search);

      const cookies = await chrome.cookies.getAll({ domain });
      if (cookies.length === 0) {
        infoCookie.innerHTML = "No cookies found";
        return "No cookies found";
      }
      cookies.forEach((cookie) => {
        if (cookie.name === "ASP.NET_SessionId") {
          importantCookie = `ASP.NET_SessionId=${cookie.value}; Path=/; HttpOnly;`;
        }
      });
      // infoCookie.innerHTML =importantCookie;
    } catch {
      url = "";
    }
  }
})();

const showMessage = (typeMess, message) => {
  if (typeMess) {
    $("#alert-success").removeClass("d-none");
    $("#alert-success").html(message);
    setTimeout(() => {
      $("#alert-success").addClass("d-none");
    }, 1500);
  } else {
    $("#alert-danger").removeClass("d-none");
    $("#alert-danger").html(message);
    setTimeout(() => {
      $("#alert-danger").addClass("d-none");
    }, 1500);
  }
};

const runRegistration = async (course, captcha) => {
  info.innerHTML = "watting for registration " + course + ".....";

  const result = await mainTool.step2(
    course,
    studentId,
    importantCookie,
    captcha,
    parsed
  );

  if (result.status && result.d != "Phiên Đăng ký không hợp lệ!") {
    showMessage(true, "Đăng ký thành công");
    info.innerHTML = result.d;
  } else {
    showMessage(false, "Đăng ký thất bại ");
    info.innerHTML = `<span class='text-danger'>${result.d}</span> `;
  }
};

async function addCourse(course) {
  if (haveCourse) {
    $("#warning-have-course").show();
    setTimeout(() => {
      $("#warning-have-course").hide();
    }, 1500);
  } else {
    $("#list-course")
      .append(`<li class="list-group-item d-flex justify-content-between align-items-center" id="${course}" >
                  <div>
                    <div> Mã môn : ${course}</div>
                    <div class='d-flex justify-content-between align-items-center'> 
                    <input type="text" class="form-control" id="input-captcha" placeholder="Mã captcha"/>
                    <div class="d-flex justify-content-between align-items-center">
                          <button type="button" class="btn btn-success" id="btn-registration-${course}">
                            Đ/ký
                          </button>
                          <button
                              type="button"
                              class="btn-close"
                              data-bs-dismiss="toast"
                              aria-label="Close"
                              id="btn-${course}"
                              class="pl-2"
                          ></button>
                          </div>
                    </div>
                </div>
            </li>`);
    haveCourse = true;

    $("#img-captcha").attr("src", "../img/sample.gif");

    await mainTool.step1(course, studentId, importantCookie);

    // add function remove when click
    $(`#btn-${course}`).click((e) => {
      $(`#${course}`).remove();
      $("#img-captcha").attr("src", "");
      haveCourse = false;
    });

    // add function registration when click
    $(`#btn-registration-${course}`).click((e) => {
      const captcha = $("#input-captcha").val();

      if (captcha) runRegistration(course, captcha.trim());
    });
  }
}

// main -----------------------
$(document).ready(async function () {
  $("#warning-have-course").hide();

  if (url && url.hostname == "mydtu.duytan.edu.vn") {
    showMessage(true, "Well come 🚀🚀🚀");
    $("#warning").hide();
    $("#info-user").show();
    $("#input-add-course").show();
    // get info user from local storage
    apiKey = localStorage.getItem("apiKey");
    studentId = localStorage.getItem("studentId");
    studentId && $("#student-id").val(studentId);
    apiKey && $("#code-api").val(apiKey);

    $("#student-id").on("change", function () {
      localStorage.setItem("studentId", $(this).val());
    });

    $("#btn-add-id-course").click(function () {
      let course = $("#ip-id-course").val();
      addCourse(course);
      $("#ip-id-course").val("");
    });
  } else {
    $("#warning").show();
    $("#info-user").hide();
    $("#input-add-course").addClass("d-none");
  }

  // info.innerHTML = url.hostname;
});
