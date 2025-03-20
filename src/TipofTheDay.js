import React, { useState, useEffect } from "react";

const TipOfTheDay = () => {
  const [tips, setTips] = useState([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the tips on component mount
  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      try {
        const url = `https://tasty.p.rapidapi.com/tips/list?from=1&size=30&id=3562`;
        const options = {
          method: "GET",
          headers: {
            'x-rapidapi-key': 'b9771e9473mshbcd1bfd562090d2p18a320jsn7a37d3506da9',
            'x-rapidapi-host': 'tasty.p.rapidapi.com'
          },
        };

        const result = await fetch(url, options);
        const data = await result.json();
        console.log("API Response for Tips:", data);

        if (result.ok && data.results) {
          // Shuffle the tips or just use the first few records
          setTips(data.results.slice(0, 20)); // Getting first 8 tips
        } else {
          setError("No tips found");
        }
      } catch (error) {
        setError("Failed to fetch tips");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  
  const handleNextTip = () => {
    // Increment the current tip index to show the next tip
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length); // Wraps around when reaching the last tip
  };

  return (
    <div className="tip-of-the-day-container">
      {loading ? (
        <p>Loading tip...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="tip">
            <div className="first-recipe-description-text2">"{tips[currentTipIndex]?.tip_body}"</div>
            <div>-{tips[currentTipIndex]?.author_username}</div>
            <div className="text-end">
                <button onClick={handleNextTip} className="tipBtn">
                    Next
                </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TipOfTheDay;
