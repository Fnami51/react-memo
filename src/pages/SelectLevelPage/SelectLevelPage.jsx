import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import useEasyMode from "../../hooks/useEasyMode.jsx";

export function SelectLevelPage() {
  const { setEasyMode } = useEasyMode();

  function updateCheckbox() {
    const checkbox = document.getElementById("gameMode");
    setEasyMode(checkbox.checked);
  }
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        <label className={styles.label} htmlFor="gameMode">
          <input type="checkbox" name="gameMode" id="gameMode" onClick={updateCheckbox} />
          <div>
            <p className={styles.text}>Облегчённый режим</p>
            <p className={styles.subtext}>У вас будет 3 попытки</p>
          </div>
        </label>
      </div>
    </div>
  );
}
