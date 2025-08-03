function timeNowUser() {
  const date = new Date();
  return date.getTime();
}

const time_server = document.querySelector(".time_server");
const deposit_box_in = document.querySelector(".deposit_box_in");


let ALL_SERVERS = {};

function timeGeneration(seconds) {
  const time_manage = { hours: 0, minutes: 0, seconds: 0 };
  if (seconds >= 60 && seconds < 3600) {
    if (seconds % 60 == 0) {
      time_manage.minutes = seconds / 60;
      return `${time_manage.hours < 10 ? "0" : ""}${time_manage.hours}:${
        time_manage.minutes < 10 ? "0" : ""
      }${time_manage.minutes}:${time_manage.seconds < 10 ? "0" : ""}${
        time_manage.seconds
      }`;
    } else {
      time_manage.minutes = Math.floor(seconds / 60);
      time_manage.seconds = seconds % 60;
      return `${time_manage.hours < 10 ? "0" : ""}${time_manage.hours}:${
        time_manage.minutes < 10 ? "0" : ""
      }${time_manage.minutes}:${time_manage.seconds < 10 ? "0" : ""}${
        time_manage.seconds
      }`;
    }
  } else {
    if (seconds < 60) {
      time_manage.seconds = seconds;
      return `${time_manage.hours < 10 ? "0" : ""}${time_manage.hours}:${
        time_manage.minutes < 10 ? "0" : ""
      }${time_manage.minutes}:${time_manage.seconds < 10 ? "0" : ""}${
        time_manage.seconds
      }`;
    }
    if (seconds >= 3600) {
      if (seconds % 3600 == 0) {
        time_manage.hours = Math.floor(seconds / 3600);
        return `${time_manage.hours < 10 ? "0" : ""}${time_manage.hours}:${
          time_manage.minutes < 10 ? "0" : ""
        }${time_manage.minutes}:${time_manage.seconds < 10 ? "0" : ""}${
          time_manage.seconds
        }`;
      } else {
        time_manage.hours = Math.floor(seconds / 3600);
        if ((seconds % 3600) / 60 == 0) {
          time_manage.minutes = (seconds % 3600) / 60;
          return `${time_manage.hours < 10 ? "0" : ""}${time_manage.hours}:${
            time_manage.minutes < 10 ? "0" : ""
          }${time_manage.minutes}:${time_manage.seconds < 10 ? "0" : ""}${
            time_manage.seconds
          }`;
        } else {
          time_manage.minutes = Math.floor((seconds % 3600) / 60);
          time_manage.seconds = Math.floor(((seconds % 3600) % 60) % 60);
          return `${time_manage.hours < 10 ? "0" : ""}${time_manage.hours}:${
            time_manage.minutes < 10 ? "0" : ""
          }${time_manage.minutes}:${time_manage.seconds < 10 ? "0" : ""}${
            time_manage.seconds
          }`;
        }
      }
    }
  }
}

let currentTime = 0;






fetch(`/update`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .then((result) => {
    ALL_SERVERS = result.all;
    currentTime = result.currentTime;
    updateUrl();

    setInterval(()=>{
      currentTime++;
      for(let url in ALL_SERVERS){
        document.querySelector(`.txt_${ALL_SERVERS[url].timeLog}`).innerText = timeGeneration(currentTime-ALL_SERVERS[url].timeLog);
      }
    },1000);

  });




  
function updateUrl() {
  deposit_box_in.innerHTML = "";
  for (let url in ALL_SERVERS) {
    console.log(url);
    deposit_box_in.innerHTML += `
    <div class="deposit_in_box url_${ALL_SERVERS[url].title}" >
      <div class="deposit_box_column_1">
          <div class="deposit_box_column_img1">
            <svg class="deposit_box_column_img_1" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-server-bolt"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" /><path d="M15 20h-9a3 3 0 0 1 -3 -3v-2a3 3 0 0 1 3 -3h12" /><path d="M7 8v.01" /><path d="M7 16v.01" /><path d="M20 15l-2 3h3l-2 3" /></svg>
          </div>
      </div>
      <div class="deposit_box_column_2">
        <div class="deposit_box_column_txt1">${ALL_SERVERS[url].title}</div>
        <div class="deposit_box_column_txt2 txt_${
          ALL_SERVERS[url].timeLog
        }">${timeGeneration(currentTime - ALL_SERVERS[url].timeLog)}</div>
      </div>
      <div class="deposit_box_column_3" onclick="removeUrl('${
        ALL_SERVERS[url].title
      }')">
        <svg class="deposit_box_column_img_1" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
      </div>
    </div>
    `;
  }
}









const input = document.querySelector(".input");
function addUrl() {
  let link = new URL(input.value);
  const new_link = { title: link.hostname, link: input.value };

  messAdd("loading", link.hostname, 3);
  fetch(`/add-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(new_link),
  })
    .then((res) => res.json())
    .then((result) => {
      currentTime = result.currentTime;
      ALL_SERVERS = result.all;
      messAdd("check", "Update database", 3);
      updateUrl();
    });
}

function removeUrl(hostname) {
  fetch(`/delete-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ALL_SERVERS[hostname]),
  })
    .then((res) => res.json())
    .then((result) => {
      currentTime = result.currentTime;
      ALL_SERVERS = result.all;
      messAdd("check", "Delete item", 3);
      updateUrl();
    });
}

let count_message = -1;
const message_box = document.querySelector(".message_box");

function prov(index, seconds) {
  const message = document.querySelector(`.message_${index}`);

  setTimeout(() => {
    document.querySelector(`.message_${index}`).style["opacity"] = "1";
    document.querySelector(`.message_${index}`).style["width"] = "90%";
    document.querySelector(`.message_${index}`).style["height"] = "40px";
    setTimeout(() => {
      if (document.querySelector(`.message_${index}`) != undefined) {
        document.querySelector(`.message_${index}`).style["opacity"] = "0";
        document.querySelector(`.message_${index}`).style["width"] = "0%";
        document.querySelector(`.message_${index}`).style["height"] = "0px";
      }
      setTimeout(() => {
        if (document.querySelector(`.message_${index}`) != undefined) {
          navigator.vibrate(80);
          document.querySelector(`.message_${index}`).remove();
        }
      }, 300);
    }, seconds * 1000);
  }, 10);
}
function messAdd(type, text, seconds) {
  count_message += 1;
  console.log(type);
  if (type == "loading") {
    message_box.innerHTML += `
      <div class="message message_${count_message}">
        <div class="message_svg">
          <svg class="svg_loading" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-loader-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a9 9 0 1 0 9 9" /></svg>
        </div>
        <div class="message_text">${
          text == undefined ? "NET TEXTA" : text
        }</div>
        <div class="message_svg" onclick="close_x('message_${count_message}')">
          <svg class="svg_close" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
        </div>
      </div>`;
    prov(count_message, seconds);
  }
  if (type == "information") {
    message_box.innerHTML += `
      <div class="message message_${count_message}">
        <div class="message_svg">
          <svg class="svg_info" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
        </div>
        <div class="message_text">${
          text == undefined ? "NET TEXTA" : text
        }</div>
        <div class="message_svg" onclick="close_x('message_${count_message}')">
          <svg class="svg_close" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
        </div>
      </div>`;
    prov(count_message, seconds);
  }
  if (type == "warning") {
    message_box.innerHTML += `
        <div class="message message_${count_message}">
          <div class="message_svg">
             <svg class="svg_warn" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 9v4" /><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" /><path d="M12 16h.01" /></svg>
          </div>
          <div class="message_text">${
            text == undefined ? "NET TEXTA" : text
          }</div>
          <div class="message_svg" onclick="close_x('message_${count_message}')">
            <svg class="svg_close" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
          </div>
        </div>`;
    prov(count_message, seconds);
  }
  if (type == "copy") {
    message_box.innerHTML += `
      <div class="message message_${count_message}">
        <div class="message_svg">
          <svg class="svg_copy" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-copy"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /></svg>
        </div>
        <div class="message_text">${
          text == undefined ? "NET TEXTA" : text
        }</div>
        <div class="message_svg" onclick="close_x('message_${count_message}')">
          <svg class="svg_close" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
        </div>
      </div>`;
    prov(count_message, seconds);
  }
  if (type == "check") {
    message_box.innerHTML += `
      <div class="message message_${count_message}">
        <div class="message_svg">
          <svg class="svg_info" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" /></svg>
        </div>
        <div class="message_text">${
          text == undefined ? "NET TEXTA" : text
        }</div>
        <div class="message_svg" onclick="close_x('message_${count_message}')">
          <svg class="svg_close" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
        </div>
      </div>`;
    prov(count_message, seconds);
  }
  if (type == "transaction") {
    message_box.innerHTML += `
      <div class="message message_${count_message}">
        <div class="message_svg">
          <svg class="svg_info" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-coins"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3z" /><path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4" /><path d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598z" /><path d="M3 6v10c0 .888 .772 1.45 2 2" /><path d="M3 11c0 .888 .772 1.45 2 2" /></svg>        </div>
        <div class="message_text">${
          text == undefined ? "NET TEXTA" : text
        }</div>
        <div class="message_svg" onclick="close_x('message_${count_message}')">
          <svg class="svg_close" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
        </div>
      </div>`;
    prov(count_message, seconds);
  }
}
function close_x(class_id) {
  console.log(class_id);
  document.querySelector(`.${class_id}`).style["opacity"] = "0";
  document.querySelector(`.${class_id}`).style["width"] = "0%";
  document.querySelector(`.${class_id}`).style["height"] = "0px";
  navigator.vibrate(80);
  setTimeout(() => {
    document.querySelector(`.${class_id}`).remove();
  }, 300);
}
