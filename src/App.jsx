import { useEffect, useState } from 'react';
import './App.css';
import Card from './components/Card';

function shuffleCards(cards) {
  const shuffled = [...cards];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bestScore, setBestScore] = useState(0);
  
  const score = selectedIds.length;
  const hasWon = cards.length > 0 && score === cards.length;

  useEffect(() => {
    let ignore = false;

    async function fetchCards() {
      try {
        //await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await fetch(
          'https://rickandmortyapi.com/api/character/1,2,3,4,5,6,7,8,9,10,11,12'
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch characters: ${response.status}`);
        }

        const data = await response.json();

        if (!ignore) {
          console.log(data);
          setCards(shuffleCards(data));
        }
      } catch (error) {
          if (!ignore) {
            setError(error.message);
          }
        } finally {
          if (!ignore) {
            setLoading(false);
          }
        }
    }

    fetchCards();

    return () => {
      ignore = true;
    };
  }, []);

  function handleCardClick(id) {
      if (hasWon) {
        return;
      }
      if (selectedIds.includes(id)) {
        setSelectedIds([]);
      } else {
        const nextScore = score + 1;

        setSelectedIds([...selectedIds, id]);
        setBestScore(Math.max(bestScore, nextScore));
      }
      setCards(shuffleCards(cards));
    }

    function handleRestart() {
      setSelectedIds([]);
      setCards(shuffleCards(cards));
    }

  return (
    <main>
      <header className="game-header">
        <p className="eyebrow">A Rick and Morty memory game</p>
        <h1>Portal Recall</h1>
        <p className="instructions">
          Pick every character once 
          <br /> 
          Repeat a pick and your score resets
        </p>
      </header>
      <div className="scoreboard">
        <p>Score: {score}</p>
        <p>Best score: {bestScore}</p>
      </div>
      {hasWon && (
        <div className="win-message">
          <p>Perfect recall. Every dimension accounted for.</p>
          <button type="button" onClick={handleRestart}>
            Play again 
          </button>
        </div>
      )}
      {loading && <p>Loading characters...</p>}
      {error && <p role="alert">Could not load characters: {error}</p>}
      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            name={card.name}
            image={card.image}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </main>
  );
}

export default App;