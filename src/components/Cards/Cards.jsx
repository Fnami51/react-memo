import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import useEasyMode from "../../hooks/useEasyMode.jsx";
import firstImg from "../image/epiphany.png";
//import secondImg from "../image/alohomora.png";
import usedFirstImg from "../image/used_epiphany.png";
//import usedSecondImg from "../image/used_alohomora.png";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течении нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";

function updateCardStates(allCards, falseCards) {
  return allCards.map(card => {
    if (falseCards.some(falseCard => falseCard.id === card.id)) {
      return { ...card, open: false };
    }
    return card;
  });
}

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const [achievements, setAchievements] = useState([1, 2]);
  // Лёгкий режим
  const { easyMode } = useEasyMode();
  function getFirstAchievement() {
    if (easyMode) {
      setAchievements(prevAchievements => prevAchievements.filter(achievement => achievement !== 1));
    }
  }
  //Счётчик ошибок
  const [errors, setErrors] = useState(0);
  function addErrors() {
    setErrors(prevErrors => prevErrors + 1);
  }
  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const [superpowers, setSuperpowers] = useState([1, 2]);

  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }
  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }
  function resetGame() {
    setErrors(0);
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
  }

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может пепереходит в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */
  const openCard = clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      getFirstAchievement();
      finishGame(STATUS_WON);
      return;
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    let playerLost = 0;

    if (easyMode) {
      if (openCardsWithoutPair.length >= 2) {
        addErrors();
        setTimeout(() => {
          const closeCards = updateCardStates(nextCards, openCardsWithoutPair);
          setCards(closeCards);
        }, 2000);
      }

      playerLost = errors;
    } else {
      playerLost = openCardsWithoutPair.length >= 2 ? 3 : 0;
    }

    // "Игрок проиграл", т.к на поле есть две открытые карты без пары
    if (playerLost > 2) {
      finishGame(STATUS_LOST);
      return;
    }

    // ... игра продолжается
  };

  // Hower кнопки суперсил
  const [isDimmed, setIsDimmed] = useState(false);

  const handleMouseEnter = () => {
    setIsDimmed(true);
  };

  const handleMouseLeave = () => {
    setIsDimmed(false);
  };

  // Кнопки суперсил

  function firstSuperpower() {
    setAchievements(prevAchievements => prevAchievements.filter(achievement => achievement !== 2));
    setSuperpowers(prevSuperpowers => prevSuperpowers.filter(superpower => superpower !== 1));
    setIsDimmed(false);
    const closeCard = cards.filter(card => card.open === false);
    closeCard.map(card => (card.open = true));
    setTimeout(() => {
      closeCard.map(card => (card.open = false));
    }, 5000);
  }

  /*function secondSuperpower() {
    setAchievements(prevAchievements => prevAchievements.filter(achievement => achievement !== 2));
    setSuperpowers(prevSuperpowers => prevSuperpowers.filter(superpower => superpower !== 2));
  }*/

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновляем значение таймера в интервале
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate]);

  return (
    <>
      <div className={isDimmed ? styles.shadow : styles.noShadow}></div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.timer}>
            {status === STATUS_PREVIEW ? (
              <div>
                <p className={styles.previewText}>Запоминайте пары!</p>
                <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
              </div>
            ) : (
              <>
                <div className={styles.timerValue}>
                  <div className={styles.timerDescription}>min</div>
                  <div>{timer.minutes.toString().padStart("2", "0")}</div>
                </div>
                .
                <div className={styles.timerValue}>
                  <div className={styles.timerDescription}>sec</div>
                  <div>{timer.seconds.toString().padStart("2", "0")}</div>
                </div>
                {easyMode ? (
                  <div className={styles.errorValue}>
                    <div className={styles.timerDescription}>attempts</div>
                    <div>{3 - errors}</div>
                  </div>
                ) : null}
              </>
            )}
          </div>
          {status === STATUS_IN_PROGRESS ? (
            <div className={styles.boxbtn}>
              {superpowers.includes(1) ? (
                <div className={styles.epiphany}>
                  <button
                    className={styles.button}
                    onClick={firstSuperpower}
                    id="btn-epiphany"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img src={firstImg} alt='Суперсила "Прозрение"' />
                  </button>
                  <div className={isDimmed ? styles.tooltip : styles.noTooltip}>
                    <h3 className={styles.tooltipTitle}>Прозрение</h3>
                    <p className={styles.tooltipText}>
                      На 5 секунд показываются все карты. Таймер длительности игры на это время останавливается.
                    </p>
                  </div>
                </div>
              ) : (
                <img src={usedFirstImg} alt='Использованная "Прозрение"' />
              )}
              {/* {superpowers.includes(2) ? (
              <button className={styles.button} onClick={secondSuperpower} id="btn-alohomora">
                <img src={secondImg} alt='Суперсила "Алохомора"' />
              </button>
            ) : (
              <img src={usedSecondImg} alt='Использованная "Алохомора"' />
            )} */}
            </div>
          ) : null}
          {status === STATUS_IN_PROGRESS ? <Button onClick={resetGame}>Начать заново</Button> : null}
        </div>

        <div className={styles.cards}>
          {cards.map(card => (
            <Card
              key={card.id}
              onClick={() => openCard(card)}
              open={status !== STATUS_IN_PROGRESS ? true : card.open}
              suit={card.suit}
              rank={card.rank}
            />
          ))}
        </div>

        {isGameEnded ? (
          <div className={styles.modalContainer}>
            <EndGameModal
              isWon={status === STATUS_WON}
              gameDurationSeconds={timer.seconds}
              gameDurationMinutes={timer.minutes}
              onClick={resetGame}
              achievements={achievements}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
