function cheakOnline() {
  if (!navigator.onLine) {
    throw new Error("Нет интернета");
  }
}

// (!) Не забудь для курсовой исправить ссылку на АПИ на вторую версию

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

export function postLeaders({ name, time }) {
  cheakOnline();
  return fetch("https://wedev-api.sky.pro/api/leaderboard", {
    method: "POST",
    body: JSON.stringify({
      name,
      time,
    }),
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Ошибка запроса");
    }
  });
}
