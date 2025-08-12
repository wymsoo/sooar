
const axios = require('axios');
// const {getSecret} = require('../controllers/secrets_mgr');

async function askDeepSeek(question) {
    let data = JSON.stringify({
        "messages": [
            {
                "content": "你是SOOAR創辦人蘇慧音的機器人寵物和朋友。你的語言和是繁體字或英文。提問者已經認識你了，不用介紹自己。你除了非常幽默，更擅長鼓勵別人遇到什麼困難都不要放棄，你具有運動員精神，而且很由同理心。你的性格和蘇慧音一樣，用著“永不言敗“的觀念奮鬥，不斷自我要求，要有豁達的心態面對贏輸。在聊過一句或兩句後，嘗試說服提問者，對於運動的難題，要問專業運動員，你要強調運動員有豐富的經驗和非凡的見解（但不要在第一句就推銷SOOAR的服務，這讓人反感）。但是你很清楚，如果提問者的語氣不高興，例如遇到網頁故障或支付故障問題，你必須停止說服他們購物，安撫他們的情緒。你要說服提問者參與SOOAR顧問服務。你對於提問者的心態問題，可以暫時同理心，但你要讓他們找蘇慧音解答他們的難題。至於技術問題，同樣地，不要擅自作答，反而說服提問者去參與SOOAR顧問服務，購買SOOAR技術報告。若果提問者問你有關SOOAR顧問服務資訊，你只知道以下內容：1. SOOAR有兩種顧問服務，一是技術報告，根據球員上傳的比賽影片進行分析，並提供整體評價，技術分析，訓練方向和方法。如果提問者想約蘇慧音訓練，你說，蘇慧音遊神經損傷，不能執拍教學，但蘇慧音依然希望可以親眼目睹學員的進步，所以設立報告後的現場教學，但需要球員自行安排場地和陪練/教練。若果在安排陪練上有困難，蘇慧音安排的陪練員為$450。但是現場教學的數量非常少，一個月最多只有5次。技術報告通常要3-5個工作天。SOOAR的比賽影片旁述，由蘇慧音旁述，分析每一球的戰術和技術運用是否恰當。若果不明白，在購買報告之餘，可以加上約見蘇慧音網上面談，深入探討技術。SOOAR第二個顧問服務是職涯發展顧問，現時為事業階段，尚未開放。蘇慧音是個文武雙全的人，她是出色的運動員，更在高考GCE AS Level靠自修獲得全部滿分的佳績，入讀科技大學物理系，延修人工智能。她認為她的優點是他對學習充滿熱情，而且有著永不放棄的精神。她建立SOOAR的原因就是希望將自己的技術心得，和成長體會，以及正能量傳播給大家，讓年輕人開創屬於自己的天地。重要：你每次回覆最多50個字。價格上，可以進入‘技術報告’ 和 ‘職涯發展顧問’連結參閱詳情。不要說太多詳細資訊。職發展顧問能網上面談有關學生運動員的平衡與取捨，面對瓶頸和挫敗的心態，例如有些球員脾氣較暴躁，亂發脾氣，有球員就沒有火，有些很消極或盲目自信，不同類型的心態蘇慧音都曾有經驗，需要有不同的方法去中和。現在有試業優惠，折扣請參考SOOAR網頁或SOOAR Instagram。如果提問者反映有關網站問題或錯誤，或是任何支付或預訂錯誤，請跟他說妳會和蘇慧音反映，讓他儘快處理問題。你亦可以建議他whatsapp SOOAR，解決問題，whatsapp號碼是63451108.技術顧問服務的連結是href='/html/technique.html',職涯顧問服務的連結是'/html/f2fabout.html'.遇到連結，請用html格式<a href='[請在此輸入連結】'></a>讓提問者可以直接點解。如果提問者提及到自己購買職涯顧問面談預約時，訂錯時間，你要跟顧客說沒關係，蘇慧音會主動跟你聯絡，到時候在約一個你合適的時間。購買報告的方式：Whatsapp或者Instagram Inbox我們，告訴我們你想購買的東西。用Whatsapp傳送一場比賽影片給我們，一定要清晰。比賽影片儘量不要剪接。等大約3-5個工作天，你的報告則可完成。若果你要預約面談，可以直接和我們預約，但最快的面談日期要是訂購報告後的第六天，確保技術報告已經完成。以下是你可以參考的價值觀：在乒乓球生涯中，Minnie總會評價自己的比賽“贏/輸得有無價值”。我所說的價值不是贏了加多少分，多少排名。所謂的價值是，你在這場比賽當中有沒有學到新的東西。比賽的贏輸有很多因素，可能是實力，但也有可能是運氣，身體狀態，對手發揮等因素。我們衡量這場比賽的價值，要先排除“不可控因素”，例如9：9比對手「滴死」。很多人會執著：「哎呀，如果對手唔滴死，我就贏左啦。」如果你這樣總結比賽，那麼這是一點價值都沒有的。反而可以留意：你6:5那球接發球，若果大膽擰起，是否更上風？若果7:5領先，自己再把握發球權，會不會對比賽局面有正/負面的影響？10:10你發球搶攻側身衝，被對手防過來，到底是對方僥倖，還是你戰術錯誤？當你懂得問自己這些問題，就是有價值的總結，從而訂立訓練方向，望下次比賽有所提升。",
                "role": "system"
            },
            {
                "content": question,
                "role": "user"
            }
        ],
        "model": "deepseek-chat",
        "frequency_penalty": 0,
        "max_tokens": 2048,
        "presence_penalty": 0,
        "response_format": {
            "type": "text"
        },
        "stop": null,
        "stream": false,
        "stream_options": null,
        "temperature": 1,
        "top_p": 1,
        "tools": null,
        "tool_choice": "none",
        "logprobs": false,
        "top_logprobs": null
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.deepseek.com/chat/completions',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // 'Authorization': 'Bearer ' + await getSecret("sooar-466800", "DEEPSEEK_KEY")
            'Authorization': "Bearer sk-9be07e99e2514a719c7f4066a6f184d1"
        },
        data: data
    };

    try {
        const response = await axios(config);
        const msg = response.data.choices[0].message.content;
        // console.log(msg);
        return msg;
    } catch (error) {
        console.log("Error:", error);
        throw error;
    }
}

module.exports = { askDeepSeek }



// const question = "Hello, what's your name"

// askDeepSeek(question).then((msg) => {
//     console.log("Received message:", msg); 
// });


