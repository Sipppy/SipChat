function _0x2b64(){const _0x1640b=['4548546yYUdhG','3288050bsffYK','105iJPEIW','1:409416971951:web:f29c6035a36c6a7556465a','409416971951','4604688QQNnDb','593012SHtZNm','spicetea-eca4b.appspot.com','55508iIxSQH','4GkBscr','spicetea-eca4b.firebaseapp.com','8376599MEkjSl','36IYyeen','AIzaSyCELymOSb_ffY5EIq82BoiBvtZ0WIjBv_M','5dAIfuK','G-13FGVGWD0R','30003303FRgCBb'];_0x2b64=function(){return _0x1640b;};return _0x2b64();}const _0x3ce5fe=_0x5704;(function(_0x480bbd,_0x5a4feb){const _0x5027fa=_0x5704,_0x456cf8=_0x480bbd();while(!![]){try{const _0x3a8652=-parseInt(_0x5027fa(0xf9))/0x1*(parseInt(_0x5027fa(0xf6))/0x2)+parseInt(_0x5027fa(0xf2))/0x3*(-parseInt(_0x5027fa(0xf8))/0x4)+parseInt(_0x5027fa(0xed))/0x5*(-parseInt(_0x5027fa(0xf0))/0x6)+parseInt(_0x5027fa(0xfb))/0x7+parseInt(_0x5027fa(0xf5))/0x8+parseInt(_0x5027fa(0xfc))/0x9*(-parseInt(_0x5027fa(0xf1))/0xa)+parseInt(_0x5027fa(0xef))/0xb;if(_0x3a8652===_0x5a4feb)break;else _0x456cf8['push'](_0x456cf8['shift']());}catch(_0x32f79a){_0x456cf8['push'](_0x456cf8['shift']());}}}(_0x2b64,0xb8462));function _0x5704(_0x2e9367,_0x8ca1b4){const _0x2b644b=_0x2b64();return _0x5704=function(_0x5704a9,_0x2f6dfc){_0x5704a9=_0x5704a9-0xed;let _0x1a1030=_0x2b644b[_0x5704a9];return _0x1a1030;},_0x5704(_0x2e9367,_0x8ca1b4);}const firebaseConfig={'apiKey':_0x3ce5fe(0xfd),'authDomain':_0x3ce5fe(0xfa),'projectId':'spicetea-eca4b','storageBucket':_0x3ce5fe(0xf7),'messagingSenderId':_0x3ce5fe(0xf4),'databaseURL':'https://spicetea-eca4b-default-rtdb.asia-southeast1.firebasedatabase.app','appId':_0x3ce5fe(0xf3),'measurementId':_0x3ce5fe(0xee)};
firebase.initializeApp(firebaseConfig);
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

document.addEventListener('DOMContentLoaded', function () {
    const postsContainer = document.getElementById('posts-container');

    const postsRef = database.ref('posts');
    postsRef.on('value', snapshot => {
        const posts = [];
        snapshot.forEach(childSnapshot => {
            const post = childSnapshot.val();
            post.key = childSnapshot.key;
            posts.push(post);
        });

        // Sort posts by number of upvotes (descending order)
        posts.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <p>${post.text}</p>
                <p class="post-time">Posted on: ${formatTime(post.timestamp)}</p>
                <div class="voting-buttons">
                    <button onclick="upvotePost('${post.key}')">&#9650;</button>
                    <span class="upvotes">${post.upvotes}</span>
                    <button onclick="downvotePost('${post.key}')">&#9660;</button>
                </div>
            `;
            postsContainer.appendChild(postElement);
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
