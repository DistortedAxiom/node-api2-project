const express = require("express");

const db = require("../data/db.js");

const router = express.Router();

router.get("/", (req, res) => {

    db.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The posts information could not be retrieved." });
        });
});

router.get("/:id", (req, res) => {

    const {id} = req.params

    db.findById(id)
        .then(post => {
            if (post.length != 0) {
                res.status(200).json(post);
            }
            else {
                res.status(400).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

router.get("/:id/comments", (req, res) => {

    const { id } = req.params;

    db.findPostComments(id)
        .then(comment => {
            if (comment.length != 0) {
                res.status(200).json(comment);
            }
            else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The comments information could not be retrieved." });
      });
  });

router.post("/", (req, res) => {
    const postData = req.body;

    db.insert(postData)
        .then(post => {
            if (!postData.title || !postData.contents) {
                res.status(404).json({ errorMessage: "Please provide title and contents for the post." });
            }
            else {
                res.status(201).json(post);
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error while saving the post to the database" });
        });
  });

router.post("/:id/comments", (req, res) => {
    const {id} = req.params;
    const new_comment = {...req.body, post_id: id}

    if (req.body.text !== null) {
        db.insertComment(new_comment)
            .then(comment => {
                console.log(comment)
                if (comment.id !== null) {
                    res.status(201).json(comment);
                }
                else {
                    res.status(404).json({
                        errorMessage: "The post with the specified ID does not exist"
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({errorMessage: "There was an error while saving the comment to the database."});
            });
    }
    else {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
})

router.delete("/:id", async (req, res) => {
    const {id} = req.params

    await db.findById(id)
    .then(post => {
        if (post.length != 0) {
            let oldPost = post;
            db.remove(id)
                .then(post => {
                    res.status(200).json(oldPost)
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ errorMessage: "The post could not be removed." });
                })
        }
        else {
            res.status(400).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ error: "The post information could not be retrieved." })
    })
});

router.put("/:id", (req, res) => {
  const {id} = req.params;
  const body = req.body;

  if ((id == null || body == null)) {
    res.status(400).json({errorMessage: "Please provide title and contents for the post."});
  }

  else {
    db.update(id, body)
    .then(post => {
        if (post != null) {
            db.findById(id).then(post => {
                let changed = post
                res.status(200).json(changed);
            })
        }
        else {
            res.status(404).json({errorMessage: "The post with the specified ID does not exist."});

        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            errorMessage: "The post information could not be modified."
        });
    });
  }
})

module.exports = router
