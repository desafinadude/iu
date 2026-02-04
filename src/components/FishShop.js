import React, { useState } from 'react';
import '../styles/FishShop.css';

const fishTypes = [
  { id: 'basic-orange', name: 'Orange Koi', price: 20, emoji: '🐟', rarity: 'common' },
  { id: 'basic-white', name: 'White Koi', price: 20, emoji: '🐟', rarity: 'common' },
  { id: 'spotted', name: 'Spotted Koi', price: 35, emoji: '🐠', rarity: 'uncommon' },
  { id: 'golden', name: 'Golden Koi', price: 50, emoji: '🐠', rarity: 'rare' },
];

const foodTypes = [
  { id: 'basic-food', name: 'Fish Flakes', price: 5, emoji: '🍚', servings: 5 },
  { id: 'premium-food', name: 'Premium Pellets', price: 15, emoji: '🍙', servings: 10 },
];

function FishShop({ coins, onPurchaseFish, onPurchaseFood, ownedFish = [] }) {
  const [purchaseMessage, setPurchaseMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('fish');

  const handlePurchaseFish = (fish) => {
    if (coins < fish.price) {
      setPurchaseMessage({ type: 'error', text: 'Not enough coins!' });
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    if (onPurchaseFish) {
      onPurchaseFish(fish);
      setPurchaseMessage({ type: 'success', text: `Got a ${fish.name}!` });
      setTimeout(() => setPurchaseMessage(null), 2000);
    }
  };

  const handlePurchaseFood = (food) => {
    if (coins < food.price) {
      setPurchaseMessage({ type: 'error', text: 'Not enough coins!' });
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    if (onPurchaseFood) {
      onPurchaseFood(food);
      setPurchaseMessage({ type: 'success', text: `Bought ${food.name}!` });
      setTimeout(() => setPurchaseMessage(null), 2000);
    }
  };

  return (
    <div className="fish-shop-page">
      <div className="fish-shop-header">
        <h2>Fish Shop</h2>
        <div className="shop-coins">
          <span className="coin-icon">&#x1FA99;</span>
          <span className="coin-total">{coins}</span>
        </div>
      </div>

      {purchaseMessage && (
        <div className={`purchase-message ${purchaseMessage.type}`}>
          {purchaseMessage.text}
        </div>
      )}

      <div className="fish-shop-tabs">
        <button
          className={`shop-tab ${activeTab === 'fish' ? 'active' : ''}`}
          onClick={() => setActiveTab('fish')}
        >
          Koi Fish
        </button>
        <button
          className={`shop-tab ${activeTab === 'food' ? 'active' : ''}`}
          onClick={() => setActiveTab('food')}
        >
          Fish Food
        </button>
      </div>

      {activeTab === 'fish' && (
        <div className="shop-items-grid">
          {fishTypes.map(fish => (
            <div key={fish.id} className={`shop-item fish-item ${fish.rarity}`}>
              <div className="item-emoji">{fish.emoji}</div>
              <h3 className="item-name">{fish.name}</h3>
              <span className={`rarity-badge ${fish.rarity}`}>{fish.rarity}</span>
              <button
                className="buy-btn"
                onClick={() => handlePurchaseFish(fish)}
                disabled={coins < fish.price}
              >
                <span className="coin-icon">&#x1FA99;</span>
                {fish.price}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'food' && (
        <div className="shop-items-grid">
          {foodTypes.map(food => (
            <div key={food.id} className="shop-item food-item">
              <div className="item-emoji">{food.emoji}</div>
              <h3 className="item-name">{food.name}</h3>
              <span className="servings-badge">{food.servings} servings</span>
              <button
                className="buy-btn"
                onClick={() => handlePurchaseFood(food)}
                disabled={coins < food.price}
              >
                <span className="coin-icon">&#x1FA99;</span>
                {food.price}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="fish-shop-coming-soon">
        <p>Feature in development - purchases are placeholders</p>
      </div>
    </div>
  );
}

export default FishShop;
