import React, { useState, useMemo } from 'react';
import { vocabPacks, getCategories, getPacksByCategory } from '../data/vocabPacks';
import '../styles/Shop.css';

function Shop({ coins, unlockedPacks, purchasePack }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [purchaseMessage, setPurchaseMessage] = useState(null);

  const categories = useMemo(() => ['all', ...getCategories()], []);
  const filteredPacks = useMemo(
    () => getPacksByCategory(selectedCategory),
    [selectedCategory]
  );

  const unlockedCount = unlockedPacks.length;
  const totalPacks = vocabPacks.length;

  const handlePurchase = (pack) => {
    if (unlockedPacks.includes(pack.id)) {
      setPurchaseMessage({ type: 'info', text: 'Already owned!' });
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    if (coins < pack.price) {
      setPurchaseMessage({ type: 'error', text: 'Not enough coins!' });
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    const success = purchasePack(pack.id, pack.price);
    if (success) {
      setPurchaseMessage({ type: 'success', text: `Unlocked ${pack.name}!` });
      setTimeout(() => setPurchaseMessage(null), 2000);
    }
  };

  const formatCategoryName = (category) => {
    if (category === 'all') return 'All Packs';
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="shop-title">
          <h2>Vocab Shop</h2>
          <p className="shop-subtitle">{unlockedCount} / {totalPacks} packs owned</p>
        </div>
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

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {formatCategoryName(category)}
          </button>
        ))}
      </div>

      <div className="packs-grid">
        {filteredPacks.map(pack => {
          const isOwned = unlockedPacks.includes(pack.id);
          const canAfford = coins >= pack.price;

          return (
            <div
              key={pack.id}
              className={`pack-card ${isOwned ? 'owned' : ''} ${!canAfford && !isOwned ? 'cant-afford' : ''}`}
            >
              <div className="pack-header">
                <h3 className="pack-name">{pack.name}</h3>
                {isOwned && <span className="owned-badge">Owned</span>}
              </div>

              <div className="pack-words">
                {pack.words.slice(0, 3).map((word, idx) => (
                  <div key={idx} className="word-preview">
                    <span className="word-japanese">{word.word}</span>
                    <span className="word-meaning">{word.translation}</span>
                  </div>
                ))}
                {pack.words.length > 3 && (
                  <div className="word-preview more">
                    +{pack.words.length - 3} more...
                  </div>
                )}
              </div>

              <button
                className={`buy-btn ${isOwned ? 'owned' : ''}`}
                onClick={() => handlePurchase(pack)}
                disabled={isOwned}
              >
                {isOwned ? (
                  'Owned'
                ) : (
                  <>
                    <span className="coin-icon">&#x1FA99;</span>
                    {pack.price}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {filteredPacks.length === 0 && (
        <div className="no-packs">No packs in this category</div>
      )}
    </div>
  );
}

export default Shop;
