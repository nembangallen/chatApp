var socket = io.connect();

var askDiv = document.getElementById('ask'),
    username = document.getElementById('username'),
    userSubmitBtn = document.getElementById('userSubmitBtn'),
    onlineDiv = document.getElementById('online'),
    chatDiv = document.getElementById('chat'),
    message = document.getElementById('message'),
    sendBtn = document.getElementById('sendBtn')
    loggedUser = document.getElementById('loggedUsers')
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback'),
    invokePrivate = document.getElementById('invokePrivate');
var my_username = document.getElementById('my_username');
//Private
var pChatDiv = document.getElementById('pchat'),
    pMessage =document.getElementById('pmessage'),
    pSendBtn =document.getElementById('psendBtn'),
    pFeedback =document.getElementById('pfeedback'),
    pOutpot =document.getElementById('poutput'),
    invokeGroup =document.getElementById('invokeGroup')
    selectUser = document.getElementById('selectuser');

var clients = [];

    var socketId ="";
    socket.on('connected',(data)=>{
       socketId = data
    }) 
//Event Listeners
    userSubmitBtn.addEventListener('click',()=>{
        sessionStorage.setItem('user',username.value);
        askDiv.style.display = 'none';
        onlineDiv.style.display = 'block';
        chatDiv.style.display = 'block';
        my_username.innerHTML = '<p>'+username.value+'</p>';

        socket.emit('logged',{
            username:username.value
        });
      
    });

    sendBtn.addEventListener('click',()=>{

        socket.emit('chat',{
            message:message.value,
            user:sessionStorage.getItem('user')
        });
    })
    pSendBtn.addEventListener('click',()=>{
        // var to = selectUser.value;
        // var from = sessionStorage.getItem('user');
        // var room1 = to.concat(from);
        // var room2 = from.concat(to);

        // if(!io.sockets.adapter.rooms(room1) || !io.sockets.adapter.rooms(room2)){
        //     socket.join(room1);
        // }
        
        socket.emit('pchat',{
            message:pMessage.value,
            user:sessionStorage.getItem('user'),
            to:selectUser.value,
            
        });
    })

    invokePrivate.addEventListener('click',()=>{
        askDiv.style.display = 'none';
        chatDiv.style.display = 'none';
        pChatDiv.style.display = 'block';
        
    })


    invokeGroup.addEventListener('click',()=>{
        askDiv.style.display = 'none';
        pChatDiv.style.display = 'none';
        chatDiv.style.display = 'block';
    })

//Server Socket Event Listeners
/**************** Online List */
    socket.on('logged',(data)=>{
        
        clients.push(data);
        loggedUser.innerHTML = '';
        loggedUser.innerHTML += '<p> Online:'+data.length+'<br>Other Users'+ data.map(info=>{
            if(username.value != info.username){
                return '<br>'+info.username
            }
 
         }) + '</p>';
         for(var i=0;i<selectUser.options.length;i++){
             selectUser.options[i] = null;
         }
         for(var i=0;i<data.length;i++){
            if(sessionStorage.getItem('user')!=data[i].username){
                var element = document.createElement("option");
                element.setAttribute("value",data[i].socket_id);
                var ename = document.createTextNode(data[i].username);
                element.appendChild(ename);
                selectUser.appendChild(element);
            }
           
        }
    })

/************ On Offline ********************/
socket.on('offline',(data)=>{
    output.innerHTML += '<p>'+data+' went offline</p>' ;
})
/*********** Group Chats*/
    socket.on('chat',(data)=>{
        output.innerHTML += '<p><strong>'+data.user+': </strong>'+data.message+'</p>' ;
    })


/*********************** To single socket */
    socket.on('pchat',(data)=>{ 

        pOutpot.innerHTML+='<p>'+data.user+'::'+data.message+'</p>' ;
    })


 