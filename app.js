var postO=""
const _0x1e94c9=_0x118d;(function(_0x5ad1ae,_0x4e749f){const _0x5f4380=_0x118d,_0x174c69=_0x5ad1ae();while(!![]){try{const _0x3714ea=parseInt(_0x5f4380(0x18c))/0x1+parseInt(_0x5f4380(0x187))/0x2+-parseInt(_0x5f4380(0x190))/0x3*(parseInt(_0x5f4380(0x196))/0x4)+parseInt(_0x5f4380(0x198))/0x5*(parseInt(_0x5f4380(0x18b))/0x6)+parseInt(_0x5f4380(0x188))/0x7*(parseInt(_0x5f4380(0x18e))/0x8)+-parseInt(_0x5f4380(0x186))/0x9*(-parseInt(_0x5f4380(0x193))/0xa)+-parseInt(_0x5f4380(0x192))/0xb*(parseInt(_0x5f4380(0x197))/0xc);if(_0x3714ea===_0x4e749f)break;else _0x174c69['push'](_0x174c69['shift']());}catch(_0x184ba2){_0x174c69['push'](_0x174c69['shift']());}}}(_0x3e5b,0x86eca));function _0x118d(_0x119345,_0x5eac15){const _0x3e5b8d=_0x3e5b();return _0x118d=function(_0x118dce,_0x469d24){_0x118dce=_0x118dce-0x186;let _0x278033=_0x3e5b8d[_0x118dce];return _0x278033;},_0x118d(_0x119345,_0x5eac15);}function _0x3e5b(){const _0x2d17cf=['386554cHSpNp','660721496583','40PfvmJV','1:660721496583:web:21969146d3d3c790ee70a2','816891UtyKLb','unhacked-spice.appspot.com','88qrQVwU','5857630uqnREZ','unhacked-spice.firebaseapp.com','AIzaSyA5vNge21pR3Y9G-JHJlrzHg6LgAo0Ksw4','4YhGFoZ','3409272LTrHwK','15FakuhS','9aIAPYY','111584KuPKdE','1517411mVFnFI','https://unhacked-spice-default-rtdb.asia-southeast1.firebasedatabase.app','unhacked-spice','1971642iwCrGp'];_0x3e5b=function(){return _0x2d17cf;};return _0x3e5b();}const post0={'apiKey':_0x1e94c9(0x195),'authDomain':_0x1e94c9(0x194),'databaseURL':_0x1e94c9(0x189),'projectId':_0x1e94c9(0x18a),'storageBucket':_0x1e94c9(0x191),'messagingSenderId':_0x1e94c9(0x18d),'appId':_0x1e94c9(0x18f)};
firebase.initializeApp(post0);
const database = firebase.database();


function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

function upvotePost(postKey) {
    const postRef = database.ref('posts/' + postKey);
    postRef.transaction(post => {
        if (post) {
            post.upvotes = (post.upvotes || 0) + 1;
        }
        return post;
    });
}

function downvotePost(postKey) {
    const postRef = database.ref('posts/' + postKey);
    postRef.transaction(post => {
        if (post) {
            post.upvotes = (post.upvotes || 0) - 1;
        }
        return post;
    });
}

function toggleReplyForm(postKey) {
    const replyForm = document.getElementById(`reply-form-${postKey}`);
    replyForm.classList.toggle('hidden');
}

function postReply(postKey) {
    const replyText = document.getElementById(`reply-text-${postKey}`).value.trim();
    if (replyText !== '') {
        const timestamp = firebase.database.ServerValue.TIMESTAMP;
        const reply = { text: replyText, timestamp };
        const repliesRef = database.ref(`posts/${postKey}/replies`);
        repliesRef.push(reply);
        document.getElementById(`reply-text-${postKey}`).value = '';
    }
}

function toggleRepliesVisibility(postKey) {
    const repliesContainer = document.getElementById(`replies-${postKey}`);
    repliesContainer.classList.toggle('hidden');
    
    const replyCountSpan = document.getElementById(`reply-count-${postKey}`);
    
    // Toggle "View Replies" button text and update reply count
    if (repliesContainer.classList.contains('hidden')) {
        replyCountSpan.textContent = '';
    } else {
        const repliesRef = database.ref(`posts/${postKey}/replies`);
        repliesRef.once('value', snapshot => {
            const repliesCount = snapshot.numChildren();
            replyCountSpan.textContent = repliesCount;
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const postsContainer = document.getElementById('posts-container');

    const postsRef = database.ref('posts');
    postsRef.on('value', snapshot => {
        const posts = [];
        snapshot.forEach(childSnapshot => {
            const post = childSnapshot.val();
            post.key = childSnapshot.key;
            post.repliesCount = 0;
            posts.push(post);
        });

        posts.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            
            const repliesRef = database.ref(`posts/${post.key}/replies`);
            repliesRef.once('value', snapshot => {
                post.repliesCount = snapshot.numChildren();
                
                postElement.innerHTML = `
                    <p>${post.text}</p>
                    <p class="post-time">Posted on: ${formatTime(post.timestamp)}</p>
                    <div class="voting-buttons">
                        <button onclick="upvotePost('${post.key}')">&#9650;</button>
                        <span class="upvotes">${post.upvotes}</span>
                        <button onclick="downvotePost('${post.key}')">&#9660;</button>
                    </div>
                    
                    <button class="rep" onclick="toggleReplyForm('${post.key}')">Reply</button>
                    <button class="view-replies-btn" onclick="toggleRepliesVisibility('${post.key}')">
                        View Replies <span id="reply-count-${post.key}">${post.repliesCount}</span>
                    </button>
                    
                    <div id="reply-form-${post.key}" class="reply-form hidden">
                        <textarea class="rar" id="reply-text-${post.key}" placeholder="Reply to this post"></textarea>
                        <button onclick="postReply('${post.key}')">📤</button>
                    </div>
                    
                    <div id="replies-${post.key}" class="replies-container hidden">
                        <!-- Replies will be dynamically added here -->
                    </div>
                `;
                postsContainer.appendChild(postElement);

                const repliesContainer = document.getElementById(`replies-${post.key}`);
                repliesRef.on('value', snapshot => {
                    const replies = [];
                    snapshot.forEach(childSnapshot => {
                        const reply = childSnapshot.val();
                        replies.push(reply);
                    });

                    repliesContainer.innerHTML = '';

                    replies.forEach(reply => {
                        const replyElement = document.createElement('div');
                        replyElement.classList.add('reply');
                        replyElement.innerHTML = `
                            <p>${reply.text}</p>
                            <p class="reply-time">Replied on: ${formatTime(reply.timestamp)}</p>
                        `;
                        repliesContainer.appendChild(replyElement);
                    });
                });
            });
        });
    });

    const postButton = document.getElementById('post-button');
    const postText = document.getElementById('post-text');

    postButton.addEventListener('click', function () {
        const text = postText.value.trim();
        if (text !== '') {
            const timestamp = firebase.database.ServerValue.TIMESTAMP;
            const post = { text, timestamp, upvotes: 0 };
            postsRef.push(post);
            postText.value = '';
        }
    });
});
