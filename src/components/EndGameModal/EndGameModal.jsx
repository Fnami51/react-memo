import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { postLeaders } from "../../api";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick }) {
  const newTime = gameDurationMinutes * 60 + gameDurationSeconds;

  const [newLeader, setUserInLeaders] = useState({
    name: "Аноним",
    time: newTime,
  });

  const title = isWon ? "Вы победили!" : "Вы проиграли!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  function addLeader() {
    postLeaders({ ...newLeader }).catch(error => {
      console.error("Error APi", error.message, error);
    });
  }

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      <input
        className={styles.input}
        type="text"
        placeholder="Пользователь"
        onChange={e => setUserInLeaders({ ...newLeader, name: e.target.value })}
      />
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>

      <Button onClick={onClick}>Начать сначала</Button>

      {isWon ? (
        <Link className={styles.link} to={"/leaderboard"} onClick={addLeader}>
          Открыть таблицу лидеров
        </Link>
      ) : null}
    </div>
  );
}
