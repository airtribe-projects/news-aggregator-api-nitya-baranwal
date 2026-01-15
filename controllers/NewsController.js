const axios = require("axios");
const NewsModel = require("../models/NewsModel");
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_CATCHER_API_KEY = process.env.NEWS_CATCHER_API_KEY;

async function getNews(req, res) {

    try
    {
        const user = req.user;
        let preferences = [];
        if (user && user.email && !user.preferences) {
            const fullUser = await require('../models/UserModel').findById(user.id);
            preferences = fullUser ? (fullUser.preferences || []) : [];
        }
    
        const q = preferences.length > 0 ? preferences.join(" OR ") : "general";
    
        // const news1 = await axios.get(`https://newsapi.org/v2/everything?q=${q}&from=2026-01-13&to=2026-01-13&sortBy=popularity&apiKey=${NEWS_API_KEY}`);
    
        // const news2 = await axios.get(`https://gnews.io/api/v4/search?q=${q}&token=${process.env.GNEWS_API_KEY}`);
    
        // const news3 = await axios.get(`https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_DATA_API_KEY}&q=${q}&language=en`);
        
        // Promise.all([news1, news2, news3]).then(([news1Data, news2Data, news3Data]) => {
        //     console.log(news3Data.data);
        //     res.status(200).json({ newsFromNewsAPI: news1Data.data.articles, newsFromGNewsAPI: news2Data.data.articles, newsFromNewsDataAPI: news3Data.data.results });
        // }).catch(error => {
        //     console.error("Error fetching news:", error);
        //     res.status(500).json({ message: "Error fetching news", error: error.message });
        // });
    
        const news1 = axios.get(`https://newsapi.org/v2/everything`, {
                params: { q, pageSize: 10, apiKey: process.env.NEWS_API_KEY }
            });
    
        const news2 = axios.get(`https://gnews.io/api/v4/search`, {
                params: { q, max: 10, token: process.env.GNEWS_API_KEY }
            });
            
        // const news3 = axios.get(`https://newsdata.io/api/1/latest`, {
        //         params: { apikey: process.env.NEWS_DATA_API_KEY, q, language: 'en', page: 1 }
        //     });

        const [news1Data, news2Data] = await Promise.all([news1, news2]);

        res.status(200).json({
            countPerSource: 10,
            news: {
                newsAPI: news1Data.data.articles,
                gNews: news2Data.data.articles
            }
        });
    }
    catch(error)
    {
        console.error("Mastery Error Log:", error.response?.data || error.message);
        res.status(500).json({ 
            message: "Error fetching news", 
            details: error.response?.data?.message || error.message 
        });
    }

}

module.exports = { getNews };
