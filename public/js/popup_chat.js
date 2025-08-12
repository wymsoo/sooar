function sendmessage() {
      const question = $('#msgSoarer').val();
      $('#msgSoarer').prop('disabled',true);
      const data = { question };
      console.log(data);
      if (!question) {
        alert("Please enter a message");
        return
      }
      const allmsg = $('#chatbox-chat-content');
      allmsg[0].insertAdjacentHTML('beforeend',
        `<div class="chatbox-message chat-user">${question}</div>`);
      allmsg[0].insertAdjacentHTML('beforeend',
        `<div class="chatbox-message soarer"><i>Soarer is typing...</i></div>`);
        $('#msgSoarer').val("");

      fetch('/deepseek/askDeepSeek', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(data)
      }).then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      }).then((data) => {
        if (data.success) {
          allmsg.children().last().remove();
          allmsg[0].insertAdjacentHTML('beforeend',
            `<div class="chatbox-message soarer">${data.msg}</div>`);
          $('#msgSoarer').prop('disabled',false);
        }
      }).catch((e) => console.error(e))

    }

    // function close(){
    //     $('#popup_chat').hidden();
    // }


    function loadchatbox() {
        fetch('/html/popup_chat.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('popup_chat').innerHTML = data;
        }).catch(e=>console.error(e));
    }

    document.addEventListener('DOMContentLoaded', loadchatbox)