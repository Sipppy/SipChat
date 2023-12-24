var post0=""
var postO=""
function _0x379a(){const _0x1eacf4=['unhacked-spice.appspot.com','https://unhacked-spice-default-rtdb.asia-southeast1.firebasedatabase.app','1:660721496583:web:21969146d3d3c790ee70a2','10282836jxDCMK','355523fodYtm','1343097QmVTcK','3eVBNCi','2579622BLZxQP','2yiDqbV','5FZPofp','10zKVftS','2926286EApraw','8HoVZeC','274348dmeywS','3910149nyeAmS','660721496583'];_0x379a=function(){return _0x1eacf4;};return _0x379a();}function _0x2595(_0x566258,_0x5ce1aa){const _0x379aae=_0x379a();return _0x2595=function(_0x259545,_0x14c49e){_0x259545=_0x259545-0x88;let _0x20c042=_0x379aae[_0x259545];return _0x20c042;},_0x2595(_0x566258,_0x5ce1aa);}const _0x196b09=_0x2595;(function(_0x43867e,_0x2a9d4b){const _0x33ac8a=_0x2595,_0x1639d8=_0x43867e();while(!![]){try{const _0x3a3860=-parseInt(_0x33ac8a(0x8f))/0x1*(-parseInt(_0x33ac8a(0x93))/0x2)+-parseInt(_0x33ac8a(0x91))/0x3*(parseInt(_0x33ac8a(0x88))/0x4)+-parseInt(_0x33ac8a(0x94))/0x5*(-parseInt(_0x33ac8a(0x92))/0x6)+parseInt(_0x33ac8a(0x90))/0x7+-parseInt(_0x33ac8a(0x97))/0x8*(-parseInt(_0x33ac8a(0x89))/0x9)+parseInt(_0x33ac8a(0x95))/0xa*(-parseInt(_0x33ac8a(0x96))/0xb)+-parseInt(_0x33ac8a(0x8e))/0xc;if(_0x3a3860===_0x2a9d4b)break;else _0x1639d8['push'](_0x1639d8['shift']());}catch(_0x37af28){_0x1639d8['push'](_0x1639d8['shift']());}}}(_0x379a,0x35c74));const firebaseConfig={'apiKey':'AIzaSyA5vNge21pR3Y9G-JHJlrzHg6LgAo0Ksw4','authDomain':'unhacked-spice.firebaseapp.com','databaseURL':_0x196b09(0x8c),'projectId':'unhacked-spice','storageBucket':_0x196b09(0x8b),'messagingSenderId':_0x196b09(0x8a),'appId':_0x196b09(0x8d)};var auth=""


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
