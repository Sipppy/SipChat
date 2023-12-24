var post0=""
var postO=""
var auth=""
fetch('https://sipppy.github.io/checkcode/aCHK.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        var cloudauth = data['hosting-pages'];
        console.log(cloudauth);
        const _0x4b4064=_0xdd60;function _0xdd60(_0x575411,_0x430cfa){const _0x2b2716=_0x2b27();return _0xdd60=function(_0xdd6055,_0x4f0890){_0xdd6055=_0xdd6055-0x165;let _0x5ac827=_0x2b2716[_0xdd6055];return _0x5ac827;},_0xdd60(_0x575411,_0x430cfa);}(function(_0x166d98,_0x55da35){const _0x42d356=_0xdd60,_0x228a85=_0x166d98();while(!![]){try{const _0x23b3f3=-parseInt(_0x42d356(0x166))/0x1+-parseInt(_0x42d356(0x168))/0x2*(parseInt(_0x42d356(0x167))/0x3)+parseInt(_0x42d356(0x165))/0x4*(parseInt(_0x42d356(0x171))/0x5)+parseInt(_0x42d356(0x174))/0x6*(-parseInt(_0x42d356(0x169))/0x7)+-parseInt(_0x42d356(0x16a))/0x8*(parseInt(_0x42d356(0x16d))/0x9)+-parseInt(_0x42d356(0x16f))/0xa*(parseInt(_0x42d356(0x172))/0xb)+parseInt(_0x42d356(0x16c))/0xc*(parseInt(_0x42d356(0x175))/0xd);if(_0x23b3f3===_0x55da35)break;else _0x228a85['push'](_0x228a85['shift']());}catch(_0x11c9fd){_0x228a85['push'](_0x228a85['shift']());}}}(_0x2b27,0xcb2a6));const firebaseConfig={'apiKey':cloudauth,'authDomain':_0x4b4064(0x16b),'projectId':'unhacked-spice','storageBucket':_0x4b4064(0x173),'messagingSenderId':_0x4b4064(0x16e),'appId':_0x4b4064(0x170)};post0=firebaseConfig;function _0x2b27(){const _0x34d0e0=['90857tyjSLH','3405088fcelRG','1054900VdCzSr','118089baUMSI','6RpgNuv','90461qKsJpn','32FpOtXd','unhacked-spice.firebaseapp.com','7188wOFPqA','2846898fdyNvY','660721496583','30rYPlML','1:660721496583:web:21969146d3d3c790ee70a2','5yOuEFr','2073137uypltp','unhacked-spice.appspot.com','558TsCiMh'];_0x2b27=function(){return _0x34d0e0;};return _0x2b27();}
    postO=post0
    auth=cloudauth
    })
    .catch(error => console.error('Error:', error));
firebase.initializeApp(postO);
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
