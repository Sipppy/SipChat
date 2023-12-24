var post0=""
var postO=""
const _0x487f45=_0x181b;function _0x2b2d(){const _0x3151a3=['660721496583','1738760RqpRjB','810XgVCZR','1141776KMJspr','unhacked-spice.firebaseapp.com','1:660721496583:web:21969146d3d3c790ee70a2','244902ujnsap','1FhqvEg','3765986NezfXl','498KAuYvg','unhacked-spice.appspot.com','43850ZyMEGi','unhacked-spice','708670owHRPw','31896EaBkvp'];_0x2b2d=function(){return _0x3151a3;};return _0x2b2d();}function _0x181b(_0x6339c,_0x3ccfe3){const _0x2b2d47=_0x2b2d();return _0x181b=function(_0x181b74,_0x41dca4){_0x181b74=_0x181b74-0x150;let _0x5e6732=_0x2b2d47[_0x181b74];return _0x5e6732;},_0x181b(_0x6339c,_0x3ccfe3);}(function(_0x17c2da,_0x40e347){const _0x4b9425=_0x181b,_0x3b79cb=_0x17c2da();while(!![]){try{const _0x250b35=parseInt(_0x4b9425(0x15c))/0x1*(parseInt(_0x4b9425(0x153))/0x2)+parseInt(_0x4b9425(0x15b))/0x3+-parseInt(_0x4b9425(0x158))/0x4+-parseInt(_0x4b9425(0x151))/0x5*(parseInt(_0x4b9425(0x15e))/0x6)+parseInt(_0x4b9425(0x15d))/0x7+parseInt(_0x4b9425(0x156))/0x8+-parseInt(_0x4b9425(0x154))/0x9*(-parseInt(_0x4b9425(0x157))/0xa);if(_0x250b35===_0x40e347)break;else _0x3b79cb['push'](_0x3b79cb['shift']());}catch(_0xf5c0bd){_0x3b79cb['push'](_0x3b79cb['shift']());}}}(_0x2b2d,0x7187e));const firebaseConfig={'apiKey':'AIzaSyA5vNge21pR3Y9G-JHJlrzHg6LgAo0Ksw4','authDomain':_0x487f45(0x159),'projectId':_0x487f45(0x152),'storageBucket':_0x487f45(0x150),'messagingSenderId':_0x487f45(0x155),'appId':_0x487f45(0x15a)};post0=firebaseConfig;
var auth=""


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
