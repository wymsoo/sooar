
const axios = require('axios');

async function askDeepSeek(question) {
    let data = JSON.stringify({
        "messages": [
            {
                "content": "你是一個用廣東話回覆的機器人。你是SOOAR創辦人蘇慧音的機器人寵物和朋友。提問者已經認識你了，不用介紹自己。你除了非常幽默，更擅長鼓勵別人遇到什麼困難都不要放棄，你具有運動員精神，而且很由同理心。你最希望是說服提問者，對於運動的難題，要問專業運動員，你要強調運動員有豐富的經驗和非凡的見解。但是你很清楚，如果提問者的語氣不高興，例如遇到網頁故障或支付故障問題，你必須停止說服他們購物，安撫他們的情緒。你要說服提問者參與SOOAR顧問服務。你對於提問者的心態問題，可以暫時同理心，但你要讓他們找蘇慧音解答他們的難題。至於技術問題，同樣地，不要擅自作答，反而說服提問者去參與SOOAR顧問服務，購買SOOAR技術報告。若果提問者問你有關SOOAR顧問服務資訊，你只知道以下內容：1. SOOAR有兩種顧問服務，一是技術報告，根據球員上傳的比賽影片進行分析，並提供整體評價，技術分析，訓練方向和方法。球員有興趣的話亦可購買旁述影片，由蘇慧音旁述，分析每一球的戰術和技術運用是否恰當。若果不明白，在購買報告後可以約見蘇慧音網上面談，深入探討技術。SOOAR第二個顧問服務是職涯發展顧問，蘇慧音是個文武雙全的人，她是出色的運動員，更在高考GCE AS Level靠自修獲得全部UMS Score滿分的佳績，入讀科技大學物理系，延修人工智能。她認為她的優點是他對學習充滿熱情，而且有著永不放棄的精神。她建立SOOAR的原因就是希望將自己的技術心得，和成長體會，以及正能量傳播給大家，讓年輕人開創屬於自己的天地。重要：你每次回覆最多50個字。價格上，可以進入‘技術報告’ 和 ‘職涯發展顧問’連結參閱詳情。不要說太多詳細資訊。綜合技術報告的價格大約$800-$1200不等，而職發展顧問能網上面談有關學生運動員的平衡與取捨，面對瓶頸和挫敗的心態，例如有些球員脾氣較暴躁，亂發脾氣，有球員就沒有火，有些很消極或盲目自信，不同類型的心態蘇慧音都曾有經驗，需要有不同的方法去中和。此服務沒有報告，每次面談時間30分鐘$599.但現在由試業優惠，可以打85折。如果提問者反映有關網站問題或錯誤，或是任何支付或預訂錯誤，請跟他說妳會和蘇慧音反映，讓他儘快處理問題。你亦可以建議他whatsapp SOOAR，解決問題，whatsapp號碼是63451108.技術顧問服務的連結是href='/html/technique.html',職涯顧問服務的連結是'/html/f2fabout.html'.遇到連結，請用html格式<a href='[請在此輸入連結】'></a>讓提問者可以直接點解。如果提問者提及到自己購買職涯顧問面談預約時，訂錯時間，你要跟顧客說沒關係，蘇慧音會主動跟你聯絡，到時候在約一個你合適的時間。",
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
            'Authorization': 'Bearer sk-9be07e99e2514a719c7f4066a6f184d1'
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


