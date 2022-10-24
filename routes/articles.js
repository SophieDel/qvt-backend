var express = require("express")
var router = express.Router()

const Article = require("../models/articles")

router.post("/new", (req, res) => {
    
    const rawTweet = req.body.tweet;
    // Mettre le tweet sous forme d'array
    const contentInArray = rawTweet.split(" ");
    // Isoler les hashtage dans le Tweet
    const hashtagsArray = contentInArray
      .filter((e) => e[0] == "#")
      .map((e) => e.toLowerCase());
    // Chaque hashtag est unique
    const hashtags = hashtagsArray ? [...new Set(hashtagsArray)] : [];
    const newTweet = new Tweet({
      rawTweet: rawTweet,
      contentInArray: contentInArray,
      hashtags: hashtags,
    });
  
})
  
  
  
  module.exports = router;