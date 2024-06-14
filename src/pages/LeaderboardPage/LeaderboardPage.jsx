import styles from "./LeaderboardPage.module.css";
import { Button } from "../../components/Button/Button.jsx";
import { getLeaders } from "../../api.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import firstAchievements from "../../components/image/yes_first_medal.png";
import firstOmission from "../../components/image/no_first_medal.png";
import secondAchievements from "../../components/image/yes_second_medal.png";
import secondOmission from "../../components/image/no_second_medal.png";

export function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  let navigate = useNavigate();

  function goToStart() {
    navigate("/");
  }

  getLeaders()
    .then(data => {
      setLeaders(data.leaders);
    })
    .catch(error => {
      console.error("Error APi", error.message, error);
    });

  let position = 0;
  const createItems = leaders
    .sort((a, b) => a.time - b.time)
    .map(leader => {
      let time = `${Math.floor(leader.time / 60)}:${leader.time % 60}`;
      position++;
      return (
        <li className={styles.box} key={leader.id}>
          <h2 className={styles.position}>№ {position}</h2>
          <h2 className={styles.name}>{leader.name}</h2>
          <div className={styles.achievements}>
            {leader.achievements.includes(1) ? (
              <img src={firstAchievements} alt="Игра пройдена в сложном режиме" />
            ) : (
              <img src={firstOmission} alt="Игра пройдена в лёгком режиме" />
            )}
            {leader.achievements.includes(2) ? (
              <img src={secondAchievements} alt="Игра пройдена без супер сил" />
            ) : (
              <img src={secondOmission} alt="Игра пройдена с супер силами" />
            )}
          </div>
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
