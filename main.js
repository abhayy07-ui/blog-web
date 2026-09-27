// js/main.js
// Page-specific logic for every page of NeuraBlog.

// ---- Category abbreviation and CSS class helpers ----
function getCategoryAbbr(category) {
    var map = {
        "Machine Learning": "ML",
        "Deep Learning": "DL",
        "Data Science": "DS",
        "Python Programming": "PY",
        "Projects and Tutorials": "PT",
        "AI Careers": "AC",
        "Responsible AI": "RA"
    };
    return map[category] || "AI";
}

// returns a CSS class for category badge coloring
function getCategoryClass(category) {
    var map = {
        "Machine Learning": "cat-ml",
        "Deep Learning": "cat-dl",
        "Data Science": "cat-ds",
        "Python Programming": "cat-py",
        "Projects and Tutorials": "cat-pt",
        "AI Careers": "cat-ac",
        "Responsible AI": "cat-ra"
    };
    return map[category] || "cat-ml";
}

// get a plain text excerpt from content (strip markdown-like syntax)
function getExcerpt(content, maxLen) {
    var plain = content.replace(/^#+\s/gm, "").replace(/```/g, "").trim();
    if (plain.length > maxLen) {
        return plain.substring(0, maxLen) + "...";
    }
    return plain;
}

function getDefaultImageForCategory(category) {
    var cat = (category || "").toLowerCase();
    if (cat.includes('machine learning')) return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('deep learning')) return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('python')) return 'https://images.unsplash.com/photo-1512758685938-1954359ce518?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('data science')) return 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('career') || cat.includes('roadmap')) return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('project') || cat.includes('tutorial')) return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('responsible')) return 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80';
    return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';
}

// ---- Shared: make a grid post card HTML ----
// used on home page, profile page, bookmarks
function makePostCard(post) {
    var users = getUsers();
    var author = users.find(function(u) { return u.id === post.authorId; });
    var authorName = author ? author.name : "Unknown";
    var readTime = getReadingTime(post.content);
    var catClass = getCategoryClass(post.category);
    var excerpt = getExcerpt(post.content, 90);

    // build tags HTML (max 3)
    var tagsHtml = "";
    if (post.tags && post.tags.length > 0) {
        var visibleTags = post.tags.slice(0, 3);
        visibleTags.forEach(function(tag) {
            tagsHtml += '<span class="tag">' + tag + '</span>';
        });
    }

    // cover image or default category image
    var imageUrl = post.coverImage || getDefaultImageForCategory(post.category);
    var mediaHtml = '<img class="post-card-img" src="' + imageUrl + '" alt="' + post.title + '" onerror="this.outerHTML=\'<div class=post-card-img-placeholder><span>\' + getCategoryAbbr(post.category) + \'</span></div>\'">';

    var html = '<div class="post-card">';
    html += mediaHtml;
    html += '<div class="post-card-body">';
    html += '<span class="post-category ' + catClass + '">' + post.category + '</span>';
    html += '<h3><a href="post.html?id=' + post.id + '">' + post.title + '</a></h3>';
    html += '<p class="post-excerpt">' + excerpt + '</p>';
    html += '<div class="post-meta">By ' + authorName + ' &bull; ' + post.date + ' &bull; ' + readTime + ' min read</div>';
    html += '<div class="post-tags">' + tagsHtml + '</div>';
    html += '<div class="post-stats"><span class="stat-icon"><svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> ' + post.views + '</span><span class="stat-icon"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> ' + post.likes + '</span></div>';
    html += '</div>';
    html += '</div>';

    return html;
}

// ---- Shared: make a horizontal list card (for explore page) ----
function makeListCard(post) {
    var users = getUsers();
    var author = users.find(function(u) { return u.id === post.authorId; });
    var authorName = author ? author.name : "Unknown";
    var readTime = getReadingTime(post.content);
    var catClass = getCategoryClass(post.category);
    var excerpt = getExcerpt(post.content, 140);

    // build tags HTML
    var tagsHtml = "";
    if (post.tags && post.tags.length > 0) {
        var visibleTags = post.tags.slice(0, 3);
        visibleTags.forEach(function(tag) {
            tagsHtml += '<span class="tag">' + tag + '</span>';
        });
    }

    // image or default category image
    var imageUrl = post.coverImage || getDefaultImageForCategory(post.category);
    var imgHtml = '<img class="post-list-card-img" src="' + imageUrl + '" alt="' + post.title + '" onerror="this.outerHTML=\'<div class=post-list-img-placeholder><span>\' + getCategoryAbbr(post.category) + \'</span></div>\'">';

    var html = '<div class="post-list-card">';
    html += imgHtml;
    html += '<div class="post-list-card-body">';
    html += '<span class="post-category ' + catClass + '">' + post.category + '</span>';
    html += '<h3><a href="post.html?id=' + post.id + '">' + post.title + '</a></h3>';
    html += '<p class="post-excerpt">' + excerpt + '</p>';
    html += '<div class="post-list-card-footer">';
    html += '<div>';
    html += '<span class="post-meta">By ' + authorName + ' &bull; ' + post.date + ' &bull; ' + readTime + ' min read</span>';
    html += '<br><div style="margin-top:4px;">' + tagsHtml + '</div>';
    html += '</div>';
    html += '<div class="post-stats"><span class="stat-icon"><svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> ' + post.views + '</span><span class="stat-icon"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> ' + post.likes + '</span></div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    return html;
}

// ---- HOME PAGE ----
function showHomePage() {
    showCategoriesRow();
    showRecentPosts();
    showMostViewedPosts();
}

// show category pills on home page
function showCategoriesRow() {
    var categories = [
        "Machine Learning", "Deep Learning", "Data Science",
        "Python Programming", "Projects and Tutorials", "AI Careers", "Responsible AI"
    ];

    var container = document.getElementById("categoriesRow");
    if (!container) return;

    var html = "";
    categories.forEach(function(cat) {
        html += '<a href="explore.html?category=' + encodeURIComponent(cat) + '" class="category-pill">' + cat + '</a>';
    });
    container.innerHTML = html;
}

// show 4 most recent published posts
function showRecentPosts() {
    var container = document.getElementById("recentPosts");
    if (!container) return;

    var posts = getPosts();
    var published = posts.filter(function(p) { return p.status === "published"; });

    // sort newest first
    published.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    var recent = published.slice(0, 4);

    if (recent.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No posts yet.</p></div>';
        return;
    }

    var html = "";
    recent.forEach(function(post) {
        html += makePostCard(post);
    });
    container.innerHTML = html;
}

// show 4 most viewed published posts
function showMostViewedPosts() {
    var container = document.getElementById("mostViewed");
    if (!container) return;

    var posts = getPosts();
    var published = posts.filter(function(p) { return p.status === "published"; });

    published.sort(function(a, b) { return b.views - a.views; });
    var top = published.slice(0, 4);

    if (top.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No posts yet.</p></div>';
        return;
    }

    var html = "";
    top.forEach(function(post) {
        html += makePostCard(post);
    });
    container.innerHTML = html;
}

// search from hero — redirect to explore page
function goToSearch() {
    var query = document.getElementById("heroSearch").value.trim();
    if (query) {
        window.location.href = "explore.html?q=" + encodeURIComponent(query);
    } else {
        window.location.href = "explore.html";
    }
}

function handleHeroSearch(event) {
    if (event.key === "Enter") {
        goToSearch();
    }
}

// ---- EXPLORE PAGE ----
function showExplorePage() {
    // pre-fill filters from URL params
    var urlParams = new URLSearchParams(window.location.search);
    var qParam = urlParams.get("q");
    var catParam = urlParams.get("category");
    var sortParam = urlParams.get("sort");

    if (qParam && document.getElementById("searchInput")) {
        document.getElementById("searchInput").value = qParam;
    }
    if (catParam && document.getElementById("categoryFilter")) {
        document.getElementById("categoryFilter").value = catParam;
    }
    if (sortParam && document.getElementById("sortBy")) {
        document.getElementById("sortBy").value = sortParam;
    }

    renderSidebarCategories();
    applyFilters();
}

// apply all filters and re-render the list
function applyFilters() {
    var searchVal = document.getElementById("searchInput") ? document.getElementById("searchInput").value.trim().toLowerCase() : "";
    var categoryVal = document.getElementById("categoryFilter") ? document.getElementById("categoryFilter").value : "";
    var tagFilterEl = document.getElementById("tagFilter");
    var tagVal = tagFilterEl ? tagFilterEl.value.trim().toLowerCase() : "";
    var sortByEl = document.getElementById("sortBy");
    var sortVal = sortByEl ? sortByEl.value : "";

    var posts = getPosts();
    var filtered = posts.filter(function(p) { return p.status === "published"; });

    // search by title or content
    if (searchVal) {
        filtered = filtered.filter(function(p) {
            return p.title.toLowerCase().indexOf(searchVal) !== -1
                || p.content.toLowerCase().indexOf(searchVal) !== -1;
        });
    }

    // filter by category
    if (categoryVal) {
        filtered = filtered.filter(function(p) { return p.category === categoryVal; });
    }

    // filter by tag
    if (tagVal) {
        filtered = filtered.filter(function(p) {
            if (!p.tags) return false;
            return p.tags.some(function(t) { return t.toLowerCase().indexOf(tagVal) !== -1; });
        });
    }

    // sort
    if (sortVal === "views") {
        filtered.sort(function(a, b) { return b.views - a.views; });
    } else if (sortVal === "likes") {
        filtered.sort(function(a, b) { return b.likes - a.likes; });
    } else {
        filtered.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    }

    // update count
    var countEl = document.getElementById("postCount");
    if (countEl) countEl.textContent = "Showing " + filtered.length + " post(s)";

    // render list cards
    var container = document.getElementById("explorePostsList");
    var emptyMsg = document.getElementById("emptyMsg");

    if (filtered.length === 0) {
        container.innerHTML = "";
        if (emptyMsg) emptyMsg.style.display = "block";
    } else {
        if (emptyMsg) emptyMsg.style.display = "none";
        var html = "";
        filtered.forEach(function(post) {
            html += makePostCard(post);
        });
        container.innerHTML = html;
    }
}

function clearFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("categoryFilter").value = "";
    document.getElementById("tagFilter").value = "";
    document.getElementById("sortBy").value = "latest";
    applyFilters();
}

function renderSidebarCategories() {
    var container = document.getElementById("sidebarCategories");
    if (!container) return;
    
    var categories = [
        {name: "Machine Learning", icon: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>"},
        {name: "Deep Learning", icon: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='3' y='3' width='18' height='18' rx='2' ry='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21 15 16 10 5 21'/></svg>"},
        {name: "Data Science", icon: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M21.21 15.89A10 10 0 1 1 8 2.83'/><path d='M22 12A10 10 0 0 0 12 2v10z'/></svg>"},
        {name: "Python Programming", icon: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polyline points='16 18 22 12 16 6'/><polyline points='8 6 2 12 8 18'/></svg>"},
        {name: "Projects and Tutorials", icon: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'/></svg>"},
        {name: "AI Careers", icon: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='2' y='7' width='20' height='14' rx='2' ry='2'/><path d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'/></svg>"},
        {name: "Responsible AI", icon: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/></svg>"}
    ];

    var posts = getPosts().filter(function(p) { return p.status === 'published'; });
    
    var html = "";
    categories.forEach(function(cat) {
        var count = posts.filter(function(p) { return p.category === cat.name; }).length;
        var catClass = getCategoryClass(cat.name);
        html += '<div class="sidebar-category-item" onclick="filterByCategory(\'' + cat.name + '\')">';
        html += '<div class="sidebar-icon ' + catClass + '">' + cat.icon + '</div>';
        html += '<span class="sidebar-name">' + cat.name + '</span>';
        html += '<span class="sidebar-count">' + count + '</span>';
        html += '</div>';
    });
    container.innerHTML = html;
}

function filterByCategory(category) {
    var select = document.getElementById("categoryFilter");
    if(select) {
        select.value = category;
        applyFilters();
    }
}

// ---- POST DETAIL PAGE ----
function showPostPage() {
    var urlParams = new URLSearchParams(window.location.search);
    var postId = parseInt(urlParams.get("id"));

    if (!postId) {
        document.getElementById("postArea").innerHTML = '<div class="notice notice-error">No post ID in URL. <a href="explore.html">Browse posts</a></div>';
        return;
    }

    var post = getPostById(postId);
    if (!post) {
        document.getElementById("postArea").innerHTML = '<div class="notice notice-error">Post not found. It may have been deleted.</div>';
        return;
    }

    document.title = post.title + " - NeuraBlog";
    incrementViews(postId);
    renderPostDetail(post);
    renderPostActions(post);
    renderComments(postId);
    renderRelatedPosts(post);
}

// render main post content
function renderPostDetail(post) {
    var container = document.getElementById("postArea");
    if (!container) return;

    var users = getUsers();
    var author = users.find(function(u) { return u.id === post.authorId; });
    var authorName = author ? author.name : "Unknown";
    var readTime = getReadingTime(post.content);
    var catClass = getCategoryClass(post.category);

    // tags
    var tagsHtml = "";
    if (post.tags && post.tags.length > 0) {
        post.tags.forEach(function(t) {
            tagsHtml += '<span class="tag">' + t + '</span> ';
        });
    }

    // cover image
    var coverHtml = "";
    if (post.coverImage) {
        coverHtml = '<img class="cover" src="' + post.coverImage + '" alt="Cover" onerror="this.style.display=\'none\'">';
    }

    // edit button only for the post author
    var currentUser = getCurrentUser();
    var editBtnHtml = "";
    if (currentUser && currentUser.id === post.authorId) {
        editBtnHtml = ' <a href="create-post.html?id=' + post.id + '" class="btn btn-outline btn-small" style="margin-left:8px;">Edit Post</a>';
    }

    var html = '<div class="post-detail">';
    html += '<span class="post-category ' + catClass + '">' + post.category + '</span>';
    html += '<h1>' + post.title + '</h1>';
    html += '<div class="post-meta">';
    html += '<span>By <strong>' + authorName + '</strong></span>';
    html += '<span>' + post.date + '</span>';
    html += '<span>' + readTime + ' min read</span>';
    html += '<span class="stat-icon"><svg viewBox="0 0 24 24" style="margin-right:4px;"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> ' + post.views + ' views</span>';
    html += editBtnHtml;
    html += '</div>';
    html += coverHtml;
    html += '<div style="margin-bottom:18px;">' + tagsHtml + '</div>';
    html += '<div class="post-content">' + renderContent(post.content) + '</div>';
    html += '</div>';

    container.innerHTML = html;
}

// render like and bookmark buttons
function renderPostActions(post) {
    var container = document.getElementById("postActionsArea");
    if (!container) return;

    var latestPost = getPostById(post.id);
    var liked = hasLiked(post.id);
    var bookmarked = hasBookmarked(post.id);

    var html = '<div class="post-actions">';
    html += '<button id="likeBtn" class="' + (liked ? "liked" : "") + '" onclick="handleLike(' + post.id + ')">';
    html += (liked ? "Liked" : "Like") + ' (' + latestPost.likes + ')';
    html += '</button>';
    html += '<button id="bookmarkBtn" class="' + (bookmarked ? "bookmarked" : "") + '" onclick="handleBookmark(' + post.id + ')">';
    html += (bookmarked ? "Bookmarked" : "Bookmark");
    html += '</button>';
    html += '</div>';

    container.innerHTML = html;
}

function handleLike(postId) {
    toggleLike(postId);
    var post = getPostById(postId);
    renderPostActions(post);
}

function handleBookmark(postId) {
    toggleBookmark(postId);
    var post = getPostById(postId);
    renderPostActions(post);
}

// render comments section
function renderComments(postId) {
    var container = document.getElementById("commentsArea");
    if (!container) return;

    var comments = getCommentsForPost(postId);
    var users = getUsers();
    var currentUser = getCurrentUser();

    var commentsHtml = "";
    if (comments.length === 0) {
        commentsHtml = '<p style="color: var(--text-muted); font-size:13px; padding:10px 0;">No comments yet. Be the first to comment.</p>';
    } else {
        comments.forEach(function(comment) {
            var commenter = users.find(function(u) { return u.id === comment.userId; });
            var commenterName = commenter ? commenter.name : "Unknown";

            var deleteBtn = "";
            if (currentUser && currentUser.id === comment.userId) {
                deleteBtn = '<button class="btn-delete-comment" onclick="handleDeleteComment(' + comment.id + ', ' + postId + ')">Delete</button>';
            }

            commentsHtml += '<div class="comment-box">';
            commentsHtml += '<span class="comment-author">' + commenterName + '</span>';
            commentsHtml += '<span class="comment-date">' + comment.date + '</span>';
            commentsHtml += '<div class="comment-text">' + escapeHtml(comment.text) + '</div>';
            commentsHtml += deleteBtn;
            commentsHtml += '</div>';
        });
    }

    var html = '<div class="comments-section">';
    html += '<h2>Comments (' + comments.length + ')</h2>';
    html += commentsHtml;
    html += '<div class="comment-form" style="margin-top:16px;">';
    html += '<textarea id="newCommentText" rows="3" placeholder="Add a comment..."></textarea>';
    html += '<button class="btn btn-primary btn-small" onclick="handleAddComment(' + postId + ')">Post Comment</button>';
    html += '</div>';
    html += '</div>';

    container.innerHTML = html;
}

function handleAddComment(postId) {
    var textEl = document.getElementById("newCommentText");
    var text = textEl.value.trim();

    if (!text) {
        alert("Please write something before posting.");
        return;
    }

    addComment(postId, text);
    renderComments(postId);
}

function handleDeleteComment(commentId, postId) {
    var ok = confirm("Delete this comment?");
    if (!ok) return;
    deleteComment(commentId);
    renderComments(postId);
}

// render related posts in the sidebar
function renderRelatedPosts(post) {
    var container = document.getElementById("relatedArea");
    if (!container) return;

    var allPosts = getPosts();
    var related = allPosts.filter(function(p) {
        return p.category === post.category && p.id !== post.id && p.status === "published";
    });

    related = related.slice(0, 5);

    if (related.length === 0) {
        container.innerHTML = "";
        return;
    }

    var html = '<div class="related-posts">';
    html += '<h2>Related Posts</h2>';
    related.forEach(function(p) {
        html += '<div class="related-post-item">';
        html += '<a href="post.html?id=' + p.id + '">' + p.title + '</a>';
        html += '<div class="related-meta">' + p.date + ' &bull; ' + p.views + ' views</div>';
        html += '</div>';
    });
    html += '</div>';

    container.innerHTML = html;
}

// ---- CREATE / EDIT POST PAGE ----
function showCreatePostPage() {
    var currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }
    var urlParams = new URLSearchParams(window.location.search);
    var editId = parseInt(urlParams.get("id"));

    if (editId) {
        var post = getPostById(editId);
        if (!post) {
            alert("Post not found.");
            window.location.href = "dashboard.html";
            return;
        }

        var currentUser = getCurrentUser();
        if (currentUser.id !== post.authorId) {
            alert("You can only edit your own posts.");
            window.location.href = "dashboard.html";
            return;
        }

        document.getElementById("pageTitle").textContent = "Edit Post";
        document.title = "Edit Post - NeuraBlog";
        document.getElementById("editPostId").value = editId;
        document.getElementById("postTitle").value = post.title;
        document.getElementById("postCategory").value = post.category;
        document.getElementById("postTags").value = post.tags.join(", ");
        document.getElementById("postContent").value = post.content;
        document.getElementById("coverImageUrl").value = post.coverImage || "";
        document.getElementById("postStatus").value = post.status;

        // change the button text from "Save Post" to "Update Post"
        var saveBtnEl = document.getElementById("saveBtnText");
        if (saveBtnEl) saveBtnEl.textContent = "Update Post";
    }
}

function handleSavePost() {
    var currentUser = getCurrentUser();
    if (!currentUser) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }
    var title = document.getElementById("postTitle").value.trim();
    var category = document.getElementById("postCategory").value;
    var tagsRaw = document.getElementById("postTags").value;
    var content = document.getElementById("postContent").value.trim();
    var coverImage = document.getElementById("coverImageUrl").value.trim();
    var status = document.getElementById("postStatus").value;
    var editId = parseInt(document.getElementById("editPostId").value);

    if (!title) { alert("Please enter a title."); return; }
    if (!category) { alert("Please select a category."); return; }
    if (!content) { alert("Please write some content."); return; }

    var tags = [];
    if (tagsRaw) {
        tags = tagsRaw.split(",").map(function(t) { return t.trim(); }).filter(function(t) { return t.length > 0; });
    }

    if (editId) {
        updatePost(editId, title, category, tags, content, coverImage, status);
        alert("Post updated!");
    } else {
        createPost(title, category, tags, content, coverImage, status);
        alert("Post created!");
    }

    window.location.href = "dashboard.html";
}

function handleSuggestTags() {
    var content = document.getElementById("postContent").value;

    if (!content || content.trim().length < 20) {
        alert("Please write more content first.");
        return;
    }

    var suggestions = suggestTags(content);

    if (suggestions.length === 0) {
        alert("Not enough content to suggest tags.");
        return;
    }

    var box = document.getElementById("tagSuggestionsBox");
    var list = document.getElementById("suggestedTagsList");
    box.style.display = "block";

    var html = "";
    suggestions.forEach(function(tag) {
        html += '<span onclick="addSuggestedTag(\'' + tag + '\')">' + tag + '</span>';
    });
    list.innerHTML = html;
}

function addSuggestedTag(tag) {
    var tagsInput = document.getElementById("postTags");
    var current = tagsInput.value.trim();
    if (current) {
        var existingTags = current.split(",").map(function(t) { return t.trim().toLowerCase(); });
        if (existingTags.indexOf(tag.toLowerCase()) !== -1) return;
        tagsInput.value = current + ", " + tag;
    } else {
        tagsInput.value = tag;
    }
}

// ---- PROFILE PAGE ----
function makeProfilePostRow(post) {
    var catClass = getCategoryClass(post.category);
    var imageUrl = post.coverImage || getDefaultImageForCategory(post.category);
    
    var html = '<div class="profile-post-row">';
    html += '<img src="' + imageUrl + '" alt="Cover" class="profile-post-img">';
    html += '<div class="profile-post-content">';
    html += '<h4><a href="post.html?id=' + post.id + '">' + post.title + '</a></h4>';
    html += '<div class="profile-post-meta">' + post.date + ' &bull; ' + post.views + ' views &bull; ' + post.likes + ' likes</div>';
    html += '</div>';
    html += '<div class="profile-post-actions">';
    
    var currentUser = getCurrentUser();
    if (currentUser && currentUser.id === post.authorId) {
        html += '<a href="create-post.html?id=' + post.id + '" class="btn btn-outline btn-small">Edit</a>';
        html += '<button onclick="if(confirm(\'Delete post?\')) { deletePost(' + post.id + '); showProfilePage(); }" class="btn btn-secondary btn-small" style="margin-left:8px;">Delete</button>';
    } else {
        html += '<a href="post.html?id=' + post.id + '" class="btn btn-primary btn-small">Read More</a>';
    }
    
    html += '</div>';
    html += '</div>';
    return html;
}
function showProfilePage() {
    var currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }
    renderProfileInfo(currentUser);
    renderMyPosts();
    renderBookmarks();
}

// render profile header with avatar
function renderProfileInfo(user) {
    var container = document.getElementById("profileInfoBox");
    if (!container) return;

    // avatar: first letter of name
    var initials = user.name.charAt(0).toUpperCase();

    var githubLink = user.github ? '<a href="' + user.github + '" target="_blank">GitHub</a>' : "";
    var linkedinLink = user.linkedin ? '<a href="' + user.linkedin + '" target="_blank">LinkedIn</a>' : "";

    var bioText = user.bio ? user.bio : "No bio yet. Click Edit Profile to add one.";

    // build skill tags
    var skillsHtml = "";
    if (user.skills) {
        var skillList = user.skills.split(",");
        skillList.forEach(function(skill) {
            var s = skill.trim();
            if (s) skillsHtml += '<span class="skill-tag">' + s + '</span>';
        });
    } else {
        skillsHtml = '<span style="color: var(--text-muted); font-size:13px;">No skills listed yet.</span>';
    }

    var html = '<div class="profile-avatar">' + initials + '</div>';
    html += '<div class="profile-info-content">';
    html += '<h2>' + user.name + '</h2>';
    html += '<span class="profile-role">@' + user.name.toLowerCase().replace(/\s/g, '') + ' &bull; ' + user.role + '</span>';
    html += '<p class="profile-bio">' + bioText + '</p>';
    html += '<div class="skills-row">' + skillsHtml + '</div>';
    html += '<div class="links">' + githubLink + " " + linkedinLink + '</div>';
    html += '</div>';
    html += '<button class="btn btn-outline btn-small edit-btn" onclick="showEditProfile()">Edit Profile</button>';

    container.innerHTML = html;
}

function showEditProfile() {
    var currentUser = getCurrentUser();
    document.getElementById("editBio").value = currentUser.bio || "";
    document.getElementById("editSkills").value = currentUser.skills || "";
    document.getElementById("editGithub").value = currentUser.github || "";
    document.getElementById("editLinkedin").value = currentUser.linkedin || "";
    document.getElementById("editBioSection").style.display = "block";
    document.getElementById("editBioSection").scrollIntoView({ behavior: "smooth" });
}

function cancelEditProfile() {
    document.getElementById("editBioSection").style.display = "none";
}

function saveProfile() {
    var newBio = document.getElementById("editBio").value.trim();
    var newSkills = document.getElementById("editSkills").value.trim();
    var newGithub = document.getElementById("editGithub").value.trim();
    var newLinkedin = document.getElementById("editLinkedin").value.trim();

    var currentUser = getCurrentUser();
    var users = getUsers();

    for (var i = 0; i < users.length; i++) {
        if (users[i].id === currentUser.id) {
            users[i].bio = newBio;
            users[i].skills = newSkills;
            users[i].github = newGithub;
            users[i].linkedin = newLinkedin;
            break;
        }
    }

    saveUsers(users);
    alert("Profile updated!");
    document.getElementById("editBioSection").style.display = "none";
    renderProfileInfo(getCurrentUser());
}

// show current user's posts in profile
function renderMyPosts() {
    var currentUser = getCurrentUser();
    var posts = getPosts();
    var myPosts = posts.filter(function(p) { return p.authorId === currentUser.id; });

    var container = document.getElementById("myPostsList");
    var emptyEl = document.getElementById("myPostsEmpty");
    if (!container) return;

    if (myPosts.length === 0) {
        container.innerHTML = "";
        if (emptyEl) emptyEl.style.display = "block";
        return;
    }

    if (emptyEl) emptyEl.style.display = "none";
    var html = "";
    myPosts.forEach(function(post) {
        html += makeProfilePostRow(post);
    });
    container.innerHTML = html;
}

// show bookmarked posts
function renderBookmarks() {
    var currentUser = getCurrentUser();
    var allPosts = getPosts();
    var bookmarkedPosts = allPosts.filter(function(p) {
        return currentUser.bookmarks.indexOf(p.id) !== -1;
    });

    var container = document.getElementById("bookmarksList");
    var emptyEl = document.getElementById("bookmarksEmpty");
    if (!container) return;

    if (bookmarkedPosts.length === 0) {
        container.innerHTML = "";
        if (emptyEl) emptyEl.style.display = "block";
        return;
    }

    if (emptyEl) emptyEl.style.display = "none";
    var html = "";
    bookmarkedPosts.forEach(function(post) {
        html += makeProfilePostRow(post);
    });
    container.innerHTML = html;
}

// tab switching
function switchTab(tabId, clickedBtn) {
    var allTabs = document.querySelectorAll(".tab-content");
    allTabs.forEach(function(tab) { tab.classList.remove("active"); });

    var allBtns = document.querySelectorAll(".tab-btn");
    allBtns.forEach(function(btn) { btn.classList.remove("active"); });

    document.getElementById(tabId).classList.add("active");
    clickedBtn.classList.add("active");
}

// ---- AUTHOR DASHBOARD ----
function showDashboardPage() {
    var currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    var welcomeEl = document.getElementById("dashboardWelcome");
    if (welcomeEl) welcomeEl.textContent = "Welcome back, " + currentUser.name + "!";

    var posts = getPosts();
    var myPosts = posts.filter(function(p) { return p.authorId === currentUser.id; });

    var totalViews = 0;
    var totalLikes = 0;
    myPosts.forEach(function(p) {
        totalViews += p.views;
        totalLikes += p.likes;
    });

    var statsContainer = document.getElementById("dashboardStats");
    if (statsContainer) {
        var html = '<div class="stat-card" style="display: flex; align-items: center; gap: 16px; text-align: left;">';
        html += '<div class="sidebar-icon cat-ds" style="width:48px; height:48px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>';
        html += '<div><div class="stat-number" style="font-size:32px;">' + myPosts.length + '</div><div class="stat-label">Total Posts</div></div></div>';
        
        html += '<div class="stat-card" style="display: flex; align-items: center; gap: 16px; text-align: left;">';
        html += '<div class="sidebar-icon cat-dl" style="width:48px; height:48px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></div>';
        html += '<div><div class="stat-number" style="font-size:32px;">' + totalViews + '</div><div class="stat-label">Total Views</div></div></div>';

        html += '<div class="stat-card" style="display: flex; align-items: center; gap: 16px; text-align: left;">';
        html += '<div class="sidebar-icon cat-pt" style="width:48px; height:48px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>';
        html += '<div><div class="stat-number" style="font-size:32px;">' + totalLikes + '</div><div class="stat-label">Total Likes</div></div></div>';
        
        statsContainer.innerHTML = html;
    }

    renderDashboardTable(myPosts);
}

function renderDashboardTable(myPosts) {
    var container = document.getElementById("myPostsTableArea");
    if (!container) return;

    if (myPosts.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>You have no posts yet.</p><br><a href="create-post.html" class="btn btn-primary">Write your first post</a></div>';
        return;
    }

    var html = '<div style="overflow-x:auto;">';
    html += '<table class="data-table">';
    html += '<thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Views</th><th>Likes</th><th>Date</th><th>Actions</th></tr></thead>';
    html += '<tbody>';

    myPosts.forEach(function(post) {
        var statusBadge = post.status === "published"
            ? '<span class="badge badge-published">Published</span>'
            : '<span class="badge badge-draft">Draft</span>';

        html += '<tr>';
        html += '<td><a href="post.html?id=' + post.id + '">' + post.title + '</a></td>';
        html += '<td>' + post.category + '</td>';
        html += '<td>' + statusBadge + '</td>';
        html += '<td>' + post.views + '</td>';
        html += '<td>' + post.likes + '</td>';
        html += '<td>' + post.date + '</td>';
        html += '<td style="white-space:nowrap;">';
        html += '<a href="create-post.html?id=' + post.id + '" class="btn btn-outline btn-small" style="margin-right:6px;">Edit</a>';
        html += '<button class="btn btn-danger btn-small" onclick="handleDeleteMyPost(' + post.id + ')">Delete</button>';
        html += '</td>';
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function handleDeleteMyPost(postId) {
    var ok = confirm("Delete this post and all its comments? This cannot be undone.");
    if (!ok) return;
    deletePost(postId);
    alert("Post deleted.");
    showDashboardPage();
}

// ---- ADMIN PAGE ----
function showAdminPage() {
    var users = getUsers();
    var posts = getPosts();
    var comments = getComments();
    var contacts = getContacts();

    var statsContainer = document.getElementById("adminStats");
    if (statsContainer) {
        var html = '<div class="stat-card" style="display: flex; align-items: center; gap: 16px; text-align: left;">';
        html += '<div class="sidebar-icon cat-ml" style="width:48px; height:48px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>';
        html += '<div><div class="stat-number" style="font-size:32px;">' + users.length + '</div><div class="stat-label">Users</div></div></div>';
        
        html += '<div class="stat-card" style="display: flex; align-items: center; gap: 16px; text-align: left;">';
        html += '<div class="sidebar-icon cat-ds" style="width:48px; height:48px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>';
        html += '<div><div class="stat-number" style="font-size:32px;">' + posts.length + '</div><div class="stat-label">Posts</div></div></div>';
        
        html += '<div class="stat-card" style="display: flex; align-items: center; gap: 16px; text-align: left;">';
        html += '<div class="sidebar-icon cat-pt" style="width:48px; height:48px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></div>';
        html += '<div><div class="stat-number" style="font-size:32px;">' + comments.length + '</div><div class="stat-label">Comments</div></div></div>';

        html += '<div class="stat-card" style="display: flex; align-items: center; gap: 16px; text-align: left;">';
        html += '<div class="sidebar-icon cat-dl" style="width:48px; height:48px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>';
        html += '<div><div class="stat-number" style="font-size:32px;">' + contacts.length + '</div><div class="stat-label">Messages</div></div></div>';
        
        statsContainer.innerHTML = html;
    }

    renderAdminUsersTable(users);
    renderAdminPostsTable(posts, users);
    renderAdminCommentsTable(comments, users, posts);
    renderAdminContactsTable(contacts);
}

function renderAdminUsersTable(users) {
    var container = document.getElementById("usersTableArea");
    if (!container) return;

    var html = '<div style="overflow-x:auto;"><table class="data-table">';
    html += '<thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead><tbody>';

    users.forEach(function(user) {
        html += '<tr>';
        html += '<td>' + user.id + '</td>';
        html += '<td>' + user.name + '</td>';
        html += '<td>' + user.email + '</td>';
        html += '<td><span class="badge ' + (user.role === "admin" ? "badge-published" : "badge-draft") + '">' + user.role + '</span></td>';
        html += '<td><button class="btn btn-danger btn-small" onclick="adminDeleteUser(' + user.id + ')">Delete</button></td>';
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function renderAdminPostsTable(posts, users) {
    var container = document.getElementById("postsTableArea");
    if (!container) return;

    var html = '<div style="overflow-x:auto;"><table class="data-table">';
    html += '<thead><tr><th>ID</th><th>Title</th><th>Author</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead><tbody>';

    posts.forEach(function(post) {
        var author = users.find(function(u) { return u.id === post.authorId; });
        var authorName = author ? author.name : "Unknown";

        html += '<tr>';
        html += '<td>' + post.id + '</td>';
        html += '<td><a href="post.html?id=' + post.id + '">' + post.title + '</a></td>';
        html += '<td>' + authorName + '</td>';
        html += '<td>' + post.category + '</td>';
        html += '<td><span class="badge ' + (post.status === "published" ? "badge-published" : "badge-draft") + '">' + post.status + '</span></td>';
        html += '<td><button class="btn btn-danger btn-small" onclick="adminDeletePost(' + post.id + ')">Delete</button></td>';
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function renderAdminCommentsTable(comments, users, posts) {
    var container = document.getElementById("commentsTableArea");
    if (!container) return;

    if (comments.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); font-size:13px;">No comments yet.</p>';
        return;
    }

    var html = '<div style="overflow-x:auto;"><table class="data-table">';
    html += '<thead><tr><th>ID</th><th>Post</th><th>User</th><th>Comment</th><th>Date</th><th>Actions</th></tr></thead><tbody>';

    comments.forEach(function(comment) {
        var post = posts.find(function(p) { return p.id === comment.postId; });
        var postTitle = post ? post.title : "Deleted post";
        var user = users.find(function(u) { return u.id === comment.userId; });
        var userName = user ? user.name : "Unknown";

        html += '<tr>';
        html += '<td>' + comment.id + '</td>';
        html += '<td style="max-width:150px;">' + postTitle + '</td>';
        html += '<td>' + userName + '</td>';
        html += '<td style="max-width:220px;">' + escapeHtml(comment.text.substring(0, 80)) + (comment.text.length > 80 ? "..." : "") + '</td>';
        html += '<td>' + comment.date + '</td>';
        html += '<td><button class="btn btn-danger btn-small" onclick="adminDeleteComment(' + comment.id + ')">Delete</button></td>';
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function renderAdminContactsTable(contacts) {
    var container = document.getElementById("contactsTableArea");
    if (!container) return;

    if (contacts.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); font-size:13px;">No messages yet.</p>';
        return;
    }

    var html = '<div style="overflow-x:auto;"><table class="data-table">';
    html += '<thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Message</th><th>Date</th></tr></thead><tbody>';

    contacts.forEach(function(c) {
        html += '<tr>';
        html += '<td>' + c.id + '</td>';
        html += '<td>' + escapeHtml(c.name) + '</td>';
        html += '<td>' + escapeHtml(c.email) + '</td>';
        html += '<td style="max-width:260px;">' + escapeHtml(c.message.substring(0, 100)) + (c.message.length > 100 ? "..." : "") + '</td>';
        html += '<td>' + c.date + '</td>';
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function adminDeleteUser(userId) {
    var currentUser = getCurrentUser();
    if (userId === currentUser.id) {
        alert("You cannot delete yourself.");
        return;
    }
    var ok = confirm("Delete this user? Their posts will remain but show as 'Unknown author'.");
    if (!ok) return;
    var users = getUsers();
    var newUsers = users.filter(function(u) { return u.id !== userId; });
    saveUsers(newUsers);
    alert("User deleted.");
    showAdminPage();
}

function adminDeletePost(postId) {
    var ok = confirm("Delete this post and all its comments?");
    if (!ok) return;
    deletePost(postId);
    alert("Post deleted.");
    showAdminPage();
}

function adminDeleteComment(commentId) {
    var ok = confirm("Delete this comment?");
    if (!ok) return;
    deleteComment(commentId);
    alert("Comment deleted.");
    showAdminPage();
}

// ---- CONTACT PAGE ----
function handleContactSubmit() {
    var name = document.getElementById("contactName").value.trim();
    var email = document.getElementById("contactEmail").value.trim();
    var message = document.getElementById("contactMessage").value.trim();

    if (!name) { alert("Please enter your name."); return; }
    if (!email) { alert("Please enter your email."); return; }
    if (!message) { alert("Please write a message."); return; }

    var contacts = getContacts();
    var maxId = 0;
    contacts.forEach(function(c) { if (c.id > maxId) maxId = c.id; });

    contacts.push({
        id: maxId + 1,
        name: name,
        email: email,
        message: message,
        date: new Date().toISOString().split("T")[0]
    });

    saveContacts(contacts);
    alert("Message sent! Thank you, " + name + ".");

    document.getElementById("contactName").value = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("contactMessage").value = "";
}

// ---- Auto-inject hamburger menu logic ----
document.addEventListener('DOMContentLoaded', function() {
    var navContainer = document.querySelector('.navbar .container');
    if (navContainer) {
        var toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
        
        var navLinks = document.querySelector('.nav-links');
        var btnLogin = document.querySelector('.btn-login');
        
        // insert before btn-login
        if (btnLogin) {
            navContainer.insertBefore(toggleBtn, btnLogin);
        } else {
            navContainer.appendChild(toggleBtn);
        }
        
        toggleBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
});


// Highlight active nav link
document.addEventListener('DOMContentLoaded', function() {
    var links = document.querySelectorAll('.nav-links a');
    var currentUrl = window.location.pathname.split('/').pop() || 'index.html';
    
    links.forEach(function(link) {
        var href = link.getAttribute('href');
        if (href === currentUrl || (currentUrl === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
