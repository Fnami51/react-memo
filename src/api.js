function cheakOnline() {
  if (!navigator.onLine) {
    throw new Error("Нет интернета");
  }
}

export function getLeaders() {
  cheakOnline();
  return fetch("https://wedev-api.sky.pro/api/leaderboard", {
    method: "GET",
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Ошибка запроса");
    }
  });
}

export function postLeaders() {
  cheakOnline();
  return fetch("https://wedev-api.sky.pro/api/leaderboard", {
    method: "GET",
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Ошибка запроса");
    }
  });
}
