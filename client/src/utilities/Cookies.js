// Cookie JS
// 05/06/21 06:55AM

export const statuses = ['guest', 'student', 'staff'];

export function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

function deleteCookie(cookiename) {
  let d = new Date();
  d.setDate(d.getDate() - 1);
  let expires = ";expires=" + d;
  let name = cookiename;
  let value = "";
  document.cookie = name + "=" + value + expires + ";path=/";
};

export function deleteAllCookies() {
  deleteCookie('username');
  deleteCookie('status');
  deleteCookie('courses');
  deleteCookie('email');
  deleteCookie('phone');
  window.location.reload();
};