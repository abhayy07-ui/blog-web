// js/posts.js
// Functions for creating, editing, deleting, liking, bookmarking and commenting on posts.

// create a new post and save it to localStorage
function createPost(title, category, tags, content, coverImage, status) {
    var currentUser = getCurrentUser();
    var posts = getPosts();

    // make a new id by finding the max existing id and adding 1
    var maxId = 0;
    posts.forEach(function(p) {
        if (p.id > maxId) maxId = p.id;
    });
    var newId = maxId + 1;

    var newPost = {
        id: newId,
        title: title,
        category: category,
        tags: tags,
        content: content,
        coverImage: coverImage,
        status: status,
        views: 0,
        likes: 0,
        date: new Date().toISOString().split("T")[0],
        authorId: currentUser.id
    };

    posts.push(newPost);
    savePosts(posts);
    return newPost;
}

// update an existing post by id
function updatePost(id, title, category, tags, content, coverImage, status) {
    var posts = getPosts();
    var index = -1;

    // find the index of the post we want to update
    for (var i = 0; i < posts.length; i++) {
        if (posts[i].id === id) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        alert("Post not found.");
        return;
    }

    // update only the editable fields, keep views, likes, date and authorId
    posts[index].title = title;
    posts[index].category = category;
    posts[index].tags = tags;
    posts[index].content = content;
    posts[index].coverImage = coverImage;
    posts[index].status = status;

    savePosts(posts);
    return posts[index];
}

// delete a post by id and also delete its comments
function deletePost(id) {
    var posts = getPosts();
    var newPosts = posts.filter(function(p) { return p.id !== id; });
    savePosts(newPosts);

    // also remove all comments for this post
    var comments = getComments();
    var newComments = comments.filter(function(c) { return c.postId !== id; });
    saveComments(newComments);
}

// increment views count for a post
function incrementViews(id) {
    var posts = getPosts();
    for (var i = 0; i < posts.length; i++) {
        if (posts[i].id === id) {
            posts[i].views = posts[i].views + 1;
            break;
        }
    }
    savePosts(posts);
}

// like or unlike a post for the current user
// a user can only like a post once
function toggleLike(postId) {
    var currentUser = getCurrentUser();
    var users = getUsers();
    var posts = getPosts();

    // find the user in the array (we need to update them)
    var userIndex = -1;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === currentUser.id) {
            userIndex = i;
            break;
        }
    }

    if (userIndex === -1) return false;

    // check if user already liked this post
    var alreadyLiked = users[userIndex].likedPosts.indexOf(postId) !== -1;

    // find the post
    var postIndex = -1;
    for (var j = 0; j < posts.length; j++) {
        if (posts[j].id === postId) {
            postIndex = j;
            break;
        }
    }

    if (postIndex === -1) return false;

    if (alreadyLiked) {
        // remove the like
        users[userIndex].likedPosts = users[userIndex].likedPosts.filter(function(id) { return id !== postId; });
        posts[postIndex].likes = posts[postIndex].likes - 1;
    } else {
        // add the like
        users[userIndex].likedPosts.push(postId);
        posts[postIndex].likes = posts[postIndex].likes + 1;
    }

    saveUsers(users);
    savePosts(posts);

    // return whether the post is now liked or not
    return !alreadyLiked;
}

// check if current user has liked a post
function hasLiked(postId) {
    var currentUser = getCurrentUser();
    if (!currentUser) return false;
    return currentUser.likedPosts.indexOf(postId) !== -1;
}

// toggle bookmark for current user
function toggleBookmark(postId) {
    var currentUser = getCurrentUser();
    var users = getUsers();

    var userIndex = -1;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === currentUser.id) {
            userIndex = i;
            break;
        }
    }

    if (userIndex === -1) return false;

    var alreadyBookmarked = users[userIndex].bookmarks.indexOf(postId) !== -1;

    if (alreadyBookmarked) {
        users[userIndex].bookmarks = users[userIndex].bookmarks.filter(function(id) { return id !== postId; });
    } else {
        users[userIndex].bookmarks.push(postId);
    }

    saveUsers(users);
    return !alreadyBookmarked;
}

// check if current user has bookmarked a post
function hasBookmarked(postId) {
    var currentUser = getCurrentUser();
    if (!currentUser) return false;
    return currentUser.bookmarks.indexOf(postId) !== -1;
}

// add a comment to a post
function addComment(postId, text) {
    var currentUser = getCurrentUser();
    var comments = getComments();

    // make a new comment id
    var maxId = 0;
    comments.forEach(function(c) {
        if (c.id > maxId) maxId = c.id;
    });
    var newId = maxId + 1;

    var newComment = {
        id: newId,
        postId: postId,
        userId: currentUser.id,
        text: text,
        date: new Date().toISOString().split("T")[0]
    };

    comments.push(newComment);
    saveComments(comments);
    return newComment;
}

// delete a comment by id
function deleteComment(commentId) {
    var comments = getComments();
    var newComments = comments.filter(function(c) { return c.id !== commentId; });
    saveComments(newComments);
}

// get comments for a specific post
function getCommentsForPost(postId) {
    var comments = getComments();
    return comments.filter(function(c) { return c.postId === postId; });
}

// convert plain text content to simple HTML
// handles: # Heading, ``` code blocks, blank lines as paragraphs
function renderContent(text) {
    if (!text) return "";

    var result = "";
    var lines = text.split("\n");
    var inCodeBlock = false;
    var inKeyPoints = false;

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        // check if we are entering or leaving a code block
        if (line.trim().startsWith("```")) {
            if (inKeyPoints) { result += "</ul></div>"; inKeyPoints = false; }
            if (!inCodeBlock) {
                result += "<pre><code>";
                inCodeBlock = true;
            } else {
                result += "</code></pre>";
                inCodeBlock = false;
            }
            continue;
        }

        if (inCodeBlock) {
            // inside code block, just add the line as-is (with escaping)
            result += escapeHtml(line) + "\n";
        } else if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
            if (!inKeyPoints) {
                result += '<div class="key-points"><h3>Key Points</h3><ul>';
                inKeyPoints = true;
            }
            result += "<li>" + escapeHtml(line.trim().substring(2)) + "</li>";
        } else {
            if (inKeyPoints && line.trim() !== "") {
                result += "</ul></div>";
                inKeyPoints = false;
            }
            if (line.startsWith("# ")) {
                result += "<h2>" + escapeHtml(line.substring(2)) + "</h2>";
            } else if (line.trim() === "") {
                // blank line becomes a paragraph break
                result += "<br>";
            } else {
                result += "<p>" + escapeHtml(line) + "</p>";
            }
        }
    }
    
    if (inKeyPoints) {
        result += "</ul></div>";
    }

    return result;
}

// simple function to escape HTML special characters to prevent XSS issues
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// calculate reading time based on word count (average reading speed is 200 words/min)
function getReadingTime(content) {
    var words = content.trim().split(/\s+/).length;
    var minutes = Math.ceil(words / 200);
    return minutes;
}

// ---- AI Feature: Suggest Tags based on word frequency ----
// This is a simple word frequency counter. Not real AI, but it mimics what a tagger does.
// Logic: split content into words, count how many times each word appears,
//        ignore common stop words (the, is, and, etc.), return top 5 words.
function suggestTags(content) {
    // list of common words to ignore (stop words)
    var stopWords = [
        "the", "is", "a", "an", "and", "or", "but", "in", "on", "at",
        "to", "for", "of", "with", "by", "from", "as", "it", "its",
        "this", "that", "was", "are", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would",
        "could", "should", "may", "might", "shall", "can", "not",
        "i", "you", "he", "she", "we", "they", "my", "your", "our",
        "their", "what", "which", "who", "when", "where", "how",
        "if", "then", "so", "than", "more", "also", "just", "very",
        "all", "some", "one", "two", "use", "used", "using", "like"
    ];

    // clean the content: lowercase, remove punctuation
    var cleaned = content.toLowerCase().replace(/[^a-z0-9\s]/g, " ");

    // split into individual words
    var words = cleaned.split(/\s+/);

    // count frequency of each word using an object
    var freq = {};
    words.forEach(function(word) {
        // skip short words and stop words
        if (word.length < 3) return;
        if (stopWords.indexOf(word) !== -1) return;

        if (freq[word]) {
            freq[word] = freq[word] + 1;
        } else {
            freq[word] = 1;
        }
    });

    // convert the frequency object into an array of [word, count] pairs
    var freqArray = [];
    for (var word in freq) {
        freqArray.push([word, freq[word]]);
    }

    // sort by frequency, highest first
    freqArray.sort(function(a, b) { return b[1] - a[1]; });

    // return top 5 words as an array of strings
    var topWords = [];
    for (var i = 0; i < 5 && i < freqArray.length; i++) {
        topWords.push(freqArray[i][0]);
    }

    return topWords;
}
