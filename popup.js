// popup.js

document.addEventListener("DOMContentLoaded", async () => {
  const outputDiv = document.getElementById("output");
  const sentimentDiv = document.getElementById("sentiment");
  const API_KEY = 'AIzaSyCfvYR3qvxivO3qH-r3qfT3qLuqj0Hq8dc';  // Replace with your actual YouTube Data API key
  const API_URL = 'http://192.168.0.100:5000';

  // Get the current tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const url = tabs[0].url;
    const youtubeRegex = /^https:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]{11})/;
    const match = url.match(youtubeRegex);

    if (match && match[1]) {
      const videoId = match[1];
      outputDiv.innerHTML = `<div class="section-title">YouTube Video ID</div><p>${videoId}</p><p>Fetching comments...</p>`;

      const comments = await fetchComments(videoId);
      if (comments.length === 0) {
        outputDiv.innerHTML += "<p>No comments found for this video.</p>";
        return;
      }

      outputDiv.innerHTML += `<p>Fetched ${comments.length} comments. Performing sentiment analysis...</p>`;
      const predictions = await getSentimentPredictions(comments);
    //   const predictions = 0

    //   if (predictions) {
    //     // Process the predictions to get sentiment counts and sentiment data
    //     const sentimentCounts = { "1": 0, "0": 0, "-1": 0 };
    //     const sentimentData = []; // For trend graph
    //     const totalSentimentScore = predictions.reduce((sum, item) => sum + parseInt(item.sentiment), 0);
    //     predictions.forEach((item, index) => {
    //       sentimentCounts[item.sentiment]++;
    //       sentimentData.push({
    //         timestamp: item.timestamp,
    //         sentiment: parseInt(item.sentiment)
    //       });
    //     });

    //     // Compute metrics
    //     const totalComments = comments.length;
    //     const uniqueCommenters = new Set(comments.map(comment => comment.authorId)).size;
    //     const totalWords = comments.reduce((sum, comment) => sum + comment.text.split(/\s+/).filter(word => word.length > 0).length, 0);
    //     const avgWordLength = (totalWords / totalComments).toFixed(2);
    //     const avgSentimentScore = (totalSentimentScore / totalComments).toFixed(2);

    //     // Normalize the average sentiment score to a scale of 0 to 10
    //     const normalizedSentimentScore = (((parseFloat(avgSentimentScore) + 1) / 2) * 10).toFixed(2);

    //     // Add the Comment Analysis Summary section
    //     outputDiv.innerHTML += `
    //       <div class="section">
    //         <div class="section-title">Comment Analysis Summary</div>
    //         <div class="metrics-container">
    //           <div class="metric">
    //             <div class="metric-title">Total Comments</div>
    //             <div class="metric-value">${totalComments}</div>
    //           </div>
    //           <div class="metric">
    //             <div class="metric-title">Unique Commenters</div>
    //             <div class="metric-value">${uniqueCommenters}</div>
    //           </div>
    //           <div class="metric">
    //             <div class="metric-title">Avg Comment Length</div>
    //             <div class="metric-value">${avgWordLength} words</div>
    //           </div>
    //           <div class="metric">
    //             <div class="metric-title">Avg Sentiment Score</div>
    //             <div class="metric-value">${normalizedSentimentScore}/10</div>
    //           </div>
    //         </div>
    //       </div>
    //     `;

    //     // Add the Sentiment Analysis Results section with a placeholder for the chart
    //     outputDiv.innerHTML += `
    //       <div class="section">
    //         <div class="section-title">Sentiment Analysis Results</div>
    //         <p>See the pie chart below for sentiment distribution.</p>
    //         <div id="chart-container"></div>
    //       </div>`;

    //     // Fetch and display the pie chart inside the chart-container div
    //     // await fetchAndDisplayChart(sentimentCounts);

    //     // Add the Sentiment Trend Graph section
    //     outputDiv.innerHTML += `
    //       <div class="section">
    //         <div class="section-title">Sentiment Trend Over Time</div>
    //         <div id="trend-graph-container"></div>
    //       </div>`;

    //     // Fetch and display the sentiment trend graph
    //     // await fetchAndDisplayTrendGraph(sentimentData);

    //     // Add the Word Cloud section
    //     outputDiv.innerHTML += `
    //       <div class="section">
    //         <div class="section-title">Comment Wordcloud</div>
    //         <div id="wordcloud-container"></div>
    //       </div>`;

    //     // Fetch and display the word cloud inside the wordcloud-container div
    //     // await fetchAndDisplayWordCloud(comments.map(comment => comment.text));

    //     // Add the top comments section
    //     outputDiv.innerHTML += `
    //       <div class="section">
    //         <div class="section-title">Top 25 Comments with Sentiments</div>
    //         <ul class="comment-list">
    //           ${predictions.slice(0, 25).map((item, index) => `
    //             <li class="comment-item">
    //               <span>${index + 1}. ${item.comment}</span><br>
    //               <span class="comment-sentiment">Sentiment: ${item.sentiment}</span>
    //             </li>`).join('')}
    //         </ul>
    //       </div>`;
    //   }
    // } else {
    //   outputDiv.innerHTML = "<p>This is not a valid YouTube URL.</p>";
    // }

    displayComments(predictions)
    sentimentDiv.innerHTML = predictions;
  }});



// Assuming your div has the ID "outputDiv"
function displayComments(sentimentData) {
    const outputDiv = document.getElementById("sentiment");
    outputDiv.innerHTML = ""; // Clear previous content

    sentimentData.forEach(item => {
        // Create a new div for each comment
        const commentDiv = document.createElement("div");

        // Add different styles based on sentiment value
        let sentimentText;
        switch (item.sentiment) {
            case "1":
                sentimentText = "Positive 😊";
                commentDiv.style.color = "green";
                break;
            case "-1":
                sentimentText = "Negative 😡";
                commentDiv.style.color = "red";
                break;
            case "0":
                sentimentText = "Neutral 😐";
                commentDiv.style.color = "blue";
                break;
            default:
                sentimentText = "Unknown";
        }

        // Set the text content of the div
        commentDiv.innerHTML = `<strong>Comment:</strong> ${item.comment} <br> <strong>Sentiment:</strong> ${sentimentText}`;

        // Append the commentDiv to outputDiv
        outputDiv.appendChild(commentDiv);
    });
}

//   async function fetchComments(videoId) {
//     let comments = [];
//     let pageToken = "";
//     try {
//       while (comments.length < 500) {
//         const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&pageToken=${pageToken}&key=${API_KEY}`);
//         const data = await response.json();
//         if (data.items) {
//           data.items.forEach(item => {
//             const commentText = item.snippet.topLevelComment.snippet.textOriginal;
//             const timestamp = item.snippet.topLevelComment.snippet.publishedAt;
//             const authorId = item.snippet.topLevelComment.snippet.authorChannelId?.value || 'Unknown';
//             comments.push({ text: commentText, timestamp: timestamp, authorId: authorId });
//           });
//         }
//         pageToken = data.nextPageToken;
//         if (!pageToken) break;
//       }
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//       outputDiv.innerHTML += "<p>Error fetching comments.</p>";
//     }
//     return comments;
//   }



  async function fetchComments(videoId) {
    let comments = [];
    let pageToken = null; // Initialize as null
    try {
        do {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&pageToken=${pageToken || ""}&key=${API_KEY}`);
            const data = await response.json();
            
            if (data.items) {
                data.items.forEach(item => {
                    const commentText = item.snippet.topLevelComment.snippet.textOriginal;
                    const timestamp = item.snippet.topLevelComment.snippet.publishedAt;
                    const authorId = item.snippet.topLevelComment.snippet.authorChannelId?.value || 'Unknown';
                    // comments.push({ text: commentText, timestamp: timestamp, authorId: authorId });

                    comments.push(commentText)
                });
            }
            
            pageToken = data.nextPageToken || null; // Update token, stop if null
        } while (pageToken); // Continue if there's a nextPageToken
        
    } catch (error) {
        console.error("Error fetching comments:", error);
        outputDiv.innerHTML += "<p>Error fetching comments.</p>";
    }
    return comments;
}


  async function getSentimentPredictions(comments) {
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments })
      });
      const result = await response.json();
      if (response.ok) {
        return result; // The result now includes sentiment and timestamp
      } else {
        throw new Error(result.error || 'Error fetching predictions');
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
      outputDiv.innerHTML += "<p>Error fetching sentiment predictions.</p>";
      return null;
    }
  }

  async function fetchAndDisplayChart(sentimentCounts) {
    try {
      const response = await fetch(`${API_URL}/generate_chart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentiment_counts: sentimentCounts })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch chart image');
      }
      const blob = await response.blob();
      const imgURL = URL.createObjectURL(blob);
      const img = document.createElement('img');
      img.src = imgURL;
      img.style.width = '100%';
      img.style.marginTop = '20px';
      // Append the image to the chart-container div
      const chartContainer = document.getElementById('chart-container');
      chartContainer.appendChild(img);
    } catch (error) {
      console.error("Error fetching chart image:", error);
      outputDiv.innerHTML += "<p>Error fetching chart image.</p>";
    }
  }

  async function fetchAndDisplayWordCloud(comments) {
    try {
      const response = await fetch(`${API_URL}/generate_wordcloud`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch word cloud image');
      }
      const blob = await response.blob();
      const imgURL = URL.createObjectURL(blob);
      const img = document.createElement('img');
      img.src = imgURL;
      img.style.width = '100%';
      img.style.marginTop = '20px';
      // Append the image to the wordcloud-container div
      const wordcloudContainer = document.getElementById('wordcloud-container');
      wordcloudContainer.appendChild(img);
    } catch (error) {
      console.error("Error fetching word cloud image:", error);
      outputDiv.innerHTML += "<p>Error fetching word cloud image.</p>";
    }
  }

  async function fetchAndDisplayTrendGraph(sentimentData) {
    try {
      const response = await fetch(`${API_URL}/generate_trend_graph`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentiment_data: sentimentData })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch trend graph image');
      }
      const blob = await response.blob();
      const imgURL = URL.createObjectURL(blob);
      const img = document.createElement('img');
      img.src = imgURL;
      img.style.width = '100%';
      img.style.marginTop = '20px';
      // Append the image to the trend-graph-container div
      const trendGraphContainer = document.getElementById('trend-graph-container');
      trendGraphContainer.appendChild(img);
    } catch (error) {
      console.error("Error fetching trend graph image:", error);
      outputDiv.innerHTML += "<p>Error fetching trend graph image.</p>";
    }
  }
});

























document.getElementById("sendRequest").addEventListener("click", async () => {
    const randomText = ["This is awesome!", "Not good at all!"][Math.floor(Math.random() * 2)];

    try {
        const response = await fetch("http://192.168.0.100:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ comments: [randomText] })
        });

        const result = await response.json();
        console.log("API Response:", result); // Log API response to console
        document.getElementById("output").innerText = JSON.stringify(result);
    } catch (error) {
        console.error("Error:", error); // Log errors to console
    }
});