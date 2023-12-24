var post0=""
var postO=""
var auth=""
fetch('https://sipppy.github.io/GitCheck/Gitfunct.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        var cloudauth = data['hosting-pages'];
        console.log(cloudauth);
        const _0x414c2e=_0x456d;(function(_0x1f900a,_0x199335){const _0x33359c=_0x456d,_0x48f15d=_0x1f900a();while(!![]){try{const _0x3858a4=-parseInt(_0x33359c(0x1aa))/0x1+parseInt(_0x33359c(0x1a7))/0x2+-parseInt(_0x33359c(0x1ad))/0x3+-parseInt(_0x33359c(0x1a2))/0x4+-parseInt(_0x33359c(0x1a6))/0x5*(parseInt(_0x33359c(0x1ac))/0x6)+parseInt(_0x33359c(0x1ab))/0x7*(parseInt(_0x33359c(0x1a9))/0x8)+parseInt(_0x33359c(0x1a4))/0x9;if(_0x3858a4===_0x199335)break;else _0x48f15d['push'](_0x48f15d['shift']());}catch(_0xb03b60){_0x48f15d['push'](_0x48f15d['shift']());}}}(_0x222f,0x2f77a));function _0x222f(){const _0x4062e4=['320358ziurMU','19621jCuOjO','78VWhzFI','1162962udxLiX','1013116Lyitiy','unhacked-spice.appspot.com','8365023OuUToY','unhacked-spice','144380zxWWFp','693170sdtbOO','unhacked-spice.firebaseapp.com','728COHIGT'];_0x222f=function(){return _0x4062e4;};return _0x222f();}function _0x456d(_0x5b0079,_0x445a4a){const _0x222f61=_0x222f();return _0x456d=function(_0x456d90,_0x36f508){_0x456d90=_0x456d90-0x1a2;let _0x49873e=_0x222f61[_0x456d90];return _0x49873e;},_0x456d(_0x5b0079,_0x445a4a);}const firebaseConfig={'apiKey':'AIzaSyA5vNge21pR3Y9G-JHJlrzHg6LgAo0Ksw4','authDomain':_0x414c2e(0x1a8),'projectId':_0x414c2e(0x1a5),'storageBucket':_0x414c2e(0x1a3),'messagingSenderId':'660721496583','appId':'1:660721496583:web:21969146d3d3c790ee70a2'};post0=firebaseConfig;
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
