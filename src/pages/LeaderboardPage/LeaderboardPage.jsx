import styles from "./LeaderboardPage.module.css";
import { Button } from "../../components/Button/Button.jsx";
import { getLeaders } from "../../api.js";
import { useState } from "react";

export function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);

  function goToStart() {
    console.log("Button is press");
  }

  getLeaders()
    .then(data => {
      setLeaders(data.leaders);
    })
    .catch(error => {
      console.error("Error APi", error.message, error);
    });

  const createItems = leaders.map(leader => {
    let time = `${Math.floor(leader.time / 60)}:${leader.time % 60}`;
    return (
      <li className={styles.box}>
        <h2 className={styles.position}>№ {leader.id}</h2>
        <h2 className={styles.name}>{leader.name}</h2>
        <div className={styles.achievements}>В будущем добавим достижения</div>
        <h2 className={styles.time}>{time}</h2>
      </li>
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Таблица лидеров</h1>
        <Button onClick={goToStart}>Начать игру</Button>
      </div>
      <ul className={styles.board}>
        <li className={styles.box}>
          <h2 className={styles.topic}>Позиция</h2>
          <h2 className={styles.topic}>Пользователь</h2>
          <h2 className={styles.topic}>Достижения</h2>
          <h2 className={styles.topic}>Время</h2>
        </li>
        {createItems}
      </ul>
    </div>
  );
}
