var socket = io.connect('http://localhost:4040');

var output = document.getElementById('output'),
    user = document.getElementById('user'),
    message = document.getElementById('message'),
    btn = document.getElementById('sendbtn'),
    feedback = document.getElementById('feedback'),
    myform = document.getElementById('myform'),
    warn = document.getElementById('warn');

    btn.addEventListener('click',()=>{
        user.placeholder = '*Enter your Name';
        console.log('sent clicked');
        socket.emit('chat',{
            user:user.value,
            message:message.value
        });
        myform.reset();
    })

    message.addEventListener('keypress',()=>{
       // user.placeholder.style.color = 'red';
        user.placeholder = "You are anonymous";
        socket.emit('typing',{
            user:user.value
        })
    })
    message.addEventListener('focusout',()=>{
        user.placeholder = '*Enter your Name'
        socket.emit('focusout',{});
    })
    //Listen from events from server 
    //For typing
    socket.on('typing',(data)=>{
        console.log(typeof(data.user))
        if(!data.user)
         { 
            feedback.innerHTML='<p> anonymous typing......</p>';}
        else
            {feedback.innerHTML='<p>'+data.user + ' is typing......</p>';}

    })
    //For Focus out 
    socket.on('focusout',(data)=>{
       
        feedback.innerHTML='';
    })
    
    //For message
    socket.on('chat',(data)=>{

        feedback.innerHTML = "";
       
        if(!data.user){
            output.innerHTML += '<p> <strong>anonymous: </strong>' + data.message +'</p>';
        }else{
            output.innerHTML += '<p> <strong>'+ data.user +': </strong>' + data.message +'</p>';
        }
    })

    