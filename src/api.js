function cheakOnline() {
  if (!navigator.onLine) {
    throw new Error("Нет интернета");
  }
}

// (!) Не забудь для курсовой исправить ссылку на АПИ на вторую версию

export function getLeaders() {
  cheakOnline();
  return fetch("https://wedev-api.sky.pro/api/v2/leaderboard", {
    method: "GET",
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Ошибка запроса");
    }
  });
}

export function postLeaders({ name, time, achievements }) {
  cheakOnline();
  return fetch("https://wedev-api.sky.pro/api/v2/leaderboard", {
    method: "POST",
    body: JSON.stringify({
      name,
      time,
      achievements,
    }),
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Ошибка запроса");
    }
  });
}
