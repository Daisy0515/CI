export const hoursSeconds = (value) => {
  if (value == null) {
    return "";
  }
  let date = new Date(value);
  let Y = date.getFullYear() + "-";
  let M =
    (date.getMonth() + 1 < 10 ?
      "0" + (date.getMonth() + 1) :
      date.getMonth() + 1) + "-";
  let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ':';
  let s = date.getSeconds()  < 10 ? "0" + date.getSeconds() : date.getSeconds()
  return Y + M + D + " " + h + m + s
}
export const timestamp = (value) => {
  let newDate = new Date(value)
  newDate = new Date((newDate / 1000 + 86400) * 1000)
  return timeReversal(newDate)
}
export const specificDate = (value) => {
  if (value == null) {
    return "";
  }
  let date = new Date(value);
  let Y = date.getFullYear() + "-";
  let M =
    (date.getMonth() + 1 < 10 ?
      "0" + (date.getMonth() + 1) :
      date.getMonth() + 1) + "-";
  let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return Y + M + D
}

export const timeReversal = (value) => {
  let date = new Date(value);
  let Y = date.getFullYear();
  let M =
    (date.getMonth() + 1 < 10 ?
      "0" + (date.getMonth() + 1) :
      date.getMonth() + 1) + "-";
  let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "-";
  return D + M + Y
}