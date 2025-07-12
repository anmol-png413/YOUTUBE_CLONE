import React, { useEffect, useState } from 'react';
import './Feed.css';
import { Link } from 'react-router-dom';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';

const Feed = ({ category }) => {
  const [data, setData] = useState([]);     // ✅ Default empty array
  const [error, setError] = useState(null); // ✅ For better error handling
  const [loading, setLoading] = useState(true); // Optional loading state

  const fetchData = async () => {
    const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;

    try {
      const response = await fetch(videoList_url);
      const result = await response.json();

      if (result.items) {
        setData(result.items);
      } else {
        setData([]);
        console.warn("No items found");
      }

    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return (
    <div className="feed">
      {loading && <p>Loading videos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {Array.isArray(data) && data.length > 0 ? (
        data.map((item, index) => (
          <Link
            key={index}
            to={`video/${item.snippet?.categoryId}/${item.id}`}
            className="card"
          >
            <img src={item.snippet?.thumbnails?.medium?.url} alt="thumbnail" />
            <h2>{item.snippet?.title}</h2>
            <h3>{item.snippet?.channelTitle}</h3>
            <p>
              {value_converter(item.statistics?.viewCount)} Views &bull;
              {" " + moment(item.snippet?.publishedAt).fromNow()}
            </p>
          </Link>
        ))
      ) : (
        !loading && <p>No videos found.</p>
      )}
    </div>
  );
};

export default Feed;
