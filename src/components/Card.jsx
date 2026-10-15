function Card({ name, image, onClick }) {
  return (
    <button type="button" className="card" onClick={onClick}>
      <img src={image} alt={name} />
      <span>{name}</span>
    </button>
  );
}

export default Card;