// js/data.js
// NOTE: localStorage is NOT secure. Passwords, tokens or sensitive data should never be stored here.
// This is a frontend-only demo project for college. A real app would use a server and database.

// ---- localStorage helper functions ----

// get all users from localStorage
function getUsers() {
    var stored = localStorage.getItem("users");
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

// save users array back to localStorage
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// get all posts from localStorage
function getPosts() {
    var stored = localStorage.getItem("posts");
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

// save posts array back to localStorage
function savePosts(posts) {
    localStorage.setItem("posts", JSON.stringify(posts));
}

// get all comments from localStorage
function getComments() {
    var stored = localStorage.getItem("comments");
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

// save comments array back to localStorage
function saveComments(comments) {
    localStorage.setItem("comments", JSON.stringify(comments));
}

// get contact messages from localStorage
function getContacts() {
    var stored = localStorage.getItem("contacts");
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

// save contact messages to localStorage
function saveContacts(contacts) {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

// find a single post by its id
function getPostById(id) {
    var posts = getPosts();
    return posts.find(function(p) { return p.id === id; });
}

// find a single user by their id
function getUserById(id) {
    var users = getUsers();
    return users.find(function(u) { return u.id === id; });
}

// ---- Sample data for first visit ----

// this runs once on first load to pre-fill the site with demo data
function initSampleData() {
    // only run if data doesn't already exist
    if (localStorage.getItem("users")) {
        return;
    }

    // 3 sample users
    var sampleUsers = [
        {
            id: 1,
            name: "Demo Student",
            email: "demo@neurablog.com",
            role: "user",
            bio: "Hi, I am a 3rd semester CSE student interested in AI and ML.",
            skills: "Python, NumPy, Pandas, Scikit-learn",
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            bookmarks: [],
            likedPosts: []
        },
        {
            id: 2,
            name: "Admin User",
            email: "admin@neurablog.com",
            role: "admin",
            bio: "Site administrator.",
            skills: "Web Development, Python",
            github: "",
            linkedin: "",
            bookmarks: [],
            likedPosts: []
        },
        {
            id: 3,
            name: "Priya Sharma",
            email: "priya@example.com",
            role: "user",
            bio: "Passionate about data science and neural networks.",
            skills: "Python, TensorFlow, Data Visualization",
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            bookmarks: [],
            likedPosts: []
        }
    ];

    // 6 sample posts with realistic content
    var samplePosts = [
        {
            id: 1,
            title: "Understanding Linear Regression from Scratch",
            category: "Machine Learning",
            tags: ["linear regression", "supervised learning", "python", "numpy"],
            content: "# What is Linear Regression?\n\nLinear regression is one of the simplest and most widely used machine learning algorithms. It tries to find a straight line that best fits your data.\n\nThe idea is simple: if you have input X and output Y, linear regression finds the values of slope (m) and intercept (b) so that Y = mX + b.\n\n# Why Learn It?\n\nMost people skip this and jump to neural networks. But understanding linear regression helps you understand how learning actually works. The model makes a guess, checks the error, and adjusts its parameters.\n\n# Implementation in Python\n\n```\nimport numpy as np\nfrom sklearn.linear_model import LinearRegression\n\nX = np.array([[1],[2],[3],[4],[5]])\ny = np.array([2, 4, 5, 4, 5])\n\nmodel = LinearRegression()\nmodel.fit(X, y)\nprint(model.coef_, model.intercept_)\n```\n\nThis is the most basic way to use it. The .fit() method does all the math behind the scenes using something called Ordinary Least Squares.\n\nI learnt this in a YouTube tutorial and then tried it on a house price dataset. It actually worked pretty well for a simple dataset.",
            coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
            status: "published",
            views: 134,
            likes: 21,
            date: "2026-09-01",
            authorId: 1
        },
        {
            id: 2,
            title: "Cleaning Messy Data with Pandas",
            category: "Data Science",
            tags: ["pandas", "data cleaning", "python", "data science"],
            content: "# The Problem with Real World Data\n\nEvery data science tutorial online uses clean perfect datasets. But in real life, data is almost always messy. Missing values, wrong data types, duplicates, and inconsistent formatting.\n\nI found this out when I downloaded a Kaggle dataset for a college assignment. Half the columns had NaN values and some numeric columns had strings in them.\n\n# Common Cleaning Steps\n\nHere are the steps I usually follow:\n\n1. Check shape and info first\n2. Find missing values with isnull().sum()\n3. Decide whether to drop rows or fill missing values\n4. Fix data types with astype()\n5. Remove duplicate rows\n\n```\nimport pandas as pd\n\ndf = pd.read_csv('data.csv')\nprint(df.info())\nprint(df.isnull().sum())\n\n# fill missing numeric values with column mean\ndf['age'].fillna(df['age'].mean(), inplace=True)\n\n# drop rows where name is missing\ndf.dropna(subset=['name'], inplace=True)\n\n# remove duplicates\ndf.drop_duplicates(inplace=True)\n```\n\nPandas makes this much easier once you know which functions to use. I spent like 2 hours on this before I realized there was a built-in function for almost everything.",
            coverImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80",
            status: "published",
            views: 98,
            likes: 15,
            date: "2026-09-05",
            authorId: 3
        },
        {
            id: 3,
            title: "My First Neural Network: A Beginner Introduction",
            category: "Deep Learning",
            tags: ["neural networks", "deep learning", "tensorflow", "keras"],
            content: "# What is a Neural Network?\n\nI have been hearing about neural networks since class 10. I finally sat down and learned what they actually are. A neural network is a bunch of layers. Each layer has nodes (called neurons). The neurons in one layer connect to the next layer.\n\nInput goes in one side, passes through the hidden layers, and comes out the other side as a prediction.\n\n# The Math Part (simplified)\n\nEach connection has a weight. The neuron multiplies input by weight, adds a bias, and passes the result through an activation function like ReLU or Sigmoid. Training means adjusting those weights using backpropagation.\n\n# My First Keras Model\n\n```\nimport tensorflow as tf\nfrom tensorflow import keras\n\nmodel = keras.Sequential([\n    keras.layers.Dense(128, activation='relu', input_shape=(784,)),\n    keras.layers.Dense(64, activation='relu'),\n    keras.layers.Dense(10, activation='softmax')\n])\n\nmodel.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])\nmodel.fit(X_train, y_train, epochs=10)\n```\n\nI used the MNIST dataset (handwritten digits) for this. Got 97% accuracy which honestly felt like magic. Keras makes it look easy but there is a lot happening under the hood.",
            coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80",
            status: "published",
            views: 212,
            likes: 34,
            date: "2026-09-10",
            authorId: 3
        },
        {
            id: 4,
            title: "Sentiment Analysis using Python and TextBlob",
            category: "Python Programming",
            tags: ["nlp", "sentiment analysis", "textblob", "python", "text"],
            content: "# What is Sentiment Analysis?\n\nSentiment analysis means figuring out if a piece of text is positive, negative, or neutral. It is used in apps that analyse product reviews, social media comments, or customer feedback.\n\nI did a small project where I analysed Twitter comments about a mobile phone launch.\n\n# Using TextBlob\n\nTextBlob is a simple Python library. It is not the most powerful, but it is great for beginners.\n\n```\nfrom textblob import TextBlob\n\ntext = \"This phone is absolutely great, I love the camera!\"\nblob = TextBlob(text)\n\nprint(blob.sentiment)\n# Sentiment(polarity=0.625, subjectivity=0.6)\n```\n\nPolarity is between -1 (very negative) and 1 (very positive). Subjectivity is between 0 (very objective) and 1 (very subjective).\n\n# What I Learnt\n\nTextBlob works okay for simple sentences but struggles with sarcasm or short one-word replies. For better results people use VADER or transformer models. I plan to try those next semester.",
            coverImage: "https://images.unsplash.com/photo-1512758685938-1954359ce518?auto=format&fit=crop&w=600&q=80",
            status: "published",
            views: 76,
            likes: 12,
            date: "2026-09-14",
            authorId: 1
        },
        {
            id: 5,
            title: "How to Become an ML Engineer: My Roadmap",
            category: "AI Careers",
            tags: ["career", "ml engineer", "roadmap", "machine learning", "skills"],
            content: "# Why I Am Writing This\n\nI get asked this a lot by my college friends: how do you get into ML? I am still a student so I am not an expert, but I have spent time researching this and I wanted to share what I found.\n\n# Step 1: Get Strong in Python\n\nYou cannot skip this. Python is the main language for ML. Learn basics, then learn NumPy, Pandas, and Matplotlib. These three libraries are used in almost every ML project.\n\n# Step 2: Learn the Maths\n\nYou don't need to be a maths genius but you need:\n- Linear Algebra (matrices, vectors)\n- Probability and Statistics\n- Calculus (derivatives, chain rule)\n\n# Step 3: Learn Scikit-learn\n\nThis library has implementations of most classic ML algorithms. Start here before going to deep learning.\n\n# Step 4: Learn a Deep Learning Framework\n\nTensorFlow or PyTorch. Most tutorials use PyTorch these days.\n\n# Step 5: Build Projects\n\nProjects matter more than certificates. Even small projects like a spam classifier or house price prediction are useful for your resume.\n\nThat is my basic roadmap. I am currently on Step 3 myself.",
            coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
            status: "published",
            views: 189,
            likes: 28,
            date: "2026-09-18",
            authorId: 1
        },
        {
            id: 6,
            title: "What is Overfitting and How to Fix It",
            category: "Machine Learning",
            tags: ["overfitting", "regularization", "dropout", "machine learning", "bias variance"],
            content: "# The Problem\n\nI trained a model on my training data and got 99% accuracy. I thought I was amazing. Then I tested it on new data and got only 63%. My teacher told me my model was overfitting.\n\n# What is Overfitting?\n\nOverfitting means your model has memorised the training data instead of learning the actual patterns. It performs very well on training data but fails on unseen data.\n\nThink of it like a student who memorises all the past exam questions word by word but cannot solve a slightly different question.\n\n# How to Detect It\n\nTraining accuracy is much higher than validation accuracy. That is the main sign.\n\n# How to Fix It\n\n1. Get more training data if possible\n2. Use Dropout layers in neural networks\n3. Use Regularization (L1 or L2) in linear models\n4. Simplify your model (fewer layers or parameters)\n5. Use Early Stopping during training\n\n```\n# adding dropout in keras\nkeras.layers.Dropout(0.3)\n\n# using L2 regularization\nkeras.layers.Dense(64, activation='relu',\n    kernel_regularizer=keras.regularizers.l2(0.001))\n```\n\nAfter adding Dropout and reducing my model size, my validation accuracy went up to 88%. Still not great but much more honest.",
            coverImage: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80",
            status: "published",
            views: 155,
            likes: 22,
            date: "2026-09-22",
            authorId: 3
        }
    ];

    // save sample data to localStorage
    saveUsers(sampleUsers);
    savePosts(samplePosts);
    saveComments([]);
    saveContacts([]);
}
