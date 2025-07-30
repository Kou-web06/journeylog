// 都道府県データ
const prefectures = {
    "01": "北海道", "02": "青森県", "03": "岩手県", "04": "宮城県", "05": "秋田県",
    "06": "山形県", "07": "福島県", "08": "茨城県", "09": "栃木県", "10": "群馬県",
    "11": "埼玉県", "12": "千葉県", "13": "東京都", "14": "神奈川県", "15": "新潟県",
    "16": "富山県", "17": "石川県", "18": "福井県", "19": "山梨県", "20": "長野県",
    "21": "岐阜県", "22": "静岡県", "23": "愛知県", "24": "三重県", "25": "滋賀県",
    "26": "京都府", "27": "大阪府", "28": "兵庫県", "29": "奈良県", "30": "和歌山県",
    "31": "鳥取県", "32": "島根県", "33": "岡山県", "34": "広島県", "35": "山口県",
    "36": "徳島県", "37": "香川県", "38": "愛媛県", "39": "高知県", "40": "福岡県",
    "41": "佐賀県", "42": "長崎県", "43": "熊本県", "44": "大分県", "45": "宮崎県",
    "46": "鹿児島県", "47": "沖縄県"
};

let visitedPrefectures = new Set();

// SVGマップの読み込み
async function loadMap() {
    const container = document.querySelector('#map');
    
    // GeoloniaのSVGを使用（GitHub Pagesから取得）
    const mapUrl = "https://geolonia.github.io/japanese-prefectures/map-full.svg";
    
    try {
        const res = await fetch(mapUrl);
        if (res.ok) {
            const svg = await res.text();
            container.innerHTML = svg;
            
            const prefs = document.querySelectorAll('.geolonia-svg-map .prefecture');
            prefs.forEach((pref) => {
                // クリックイベント
                pref.addEventListener('click', (event) => {
                    const code = event.currentTarget.dataset.code;
                    togglePrefecture(code);
                });

                // ホバーエフェクト
                pref.addEventListener('mouseover', (event) => {
                    const code = event.currentTarget.dataset.code;
                    const name = prefectures[code.padStart(2, '0')];
                    if (name) {
                        event.currentTarget.setAttribute('title', name);
                    }
                });
            });
        } else {
            // フォールバック：簡易的な日本地図を表示
            container.innerHTML = '<p>地図の読み込みに失敗しました。リロードしてください。</p>';
        }
    } catch (error) {
        console.error('Map loading error:', error);
        container.innerHTML = '<p>地図の読み込みに失敗しました。リロードしてください。</p>';
    }
}

// 都道府県の制覇状態を切り替え
function togglePrefecture(code) {
    const normalizedCode = code.padStart(2, '0');
    const prefElement = document.querySelector(`[data-code="${code}"]`);
    
    if (visitedPrefectures.has(normalizedCode)) {
        visitedPrefectures.delete(normalizedCode);
        if (prefElement) prefElement.classList.remove('visited');
    } else {
        visitedPrefectures.add(normalizedCode);
        if (prefElement) prefElement.classList.add('visited');
    }
    
    updateStats();
    saveData();
}

// 統計情報の更新
function updateStats() {
    const visited = visitedPrefectures.size;
    const remaining = 47 - visited;
    const percent = Math.round((visited / 47) * 100);

    document.getElementById('visitedCount').textContent = visited;
    document.getElementById('remainingCount').textContent = remaining;
    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('progressFill').style.width = percent + '%';

    // 完全制覇の場合のメッセージ表示
    const completionMessage = document.getElementById('completionMessage');
    if (visited === 47) {
        completionMessage.style.display = 'block';
        // 花火エフェクト（簡易版）
        setTimeout(() => {
            alert('🎉 日本全国制覇おめでとうございます！ 🎉');
        }, 500);
    } else {
        completionMessage.style.display = 'none';
    }
}

// データの保存（ローカルストレージ）
function saveData() {
    localStorage.setItem('visitedPrefectures', JSON.stringify([...visitedPrefectures]));
}

// データの読み込み
function loadData() {
    const saved = localStorage.getItem('visitedPrefectures');
    if (saved) {
        visitedPrefectures = new Set(JSON.parse(saved));
        
        // 地図の色を更新
        visitedPrefectures.forEach(code => {
            const prefElement = document.querySelector(`[data-code="${parseInt(code)}"]`);
            if (prefElement) prefElement.classList.add('visited');
        });
        
        updateStats();
    }
}

// リセット
function resetAll() {
    if (confirm('すべての制覇記録をリセットしますか？')) {
        visitedPrefectures.clear();
        document.querySelectorAll('.prefecture.visited').forEach(el => el.classList.remove('visited'));
        updateStats();
        saveData();
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    loadMap().then(() => {
        loadData();
    });
});
