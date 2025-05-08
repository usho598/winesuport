/**
 * ワイサポ販売管理システム ユーティリティ関数
 * 共通して使用する JavaScript 関数を定義
 */

// 日付をフォーマットする関数 (YYYY/MM/DD)
function formatDate(date) {
  if (!date) return '';
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}/${month}/${day}`;
}

// 金額を日本円形式でフォーマットする関数 (¥123,456)
function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '';
  
  return '¥' + Number(amount).toLocaleString('ja-JP');
}

// 桁区切りを追加する関数 (1,234,567)
function formatNumber(num) {
  if (num === null || num === undefined) return '';
  
  return Number(num).toLocaleString('ja-JP');
}

// クエリパラメータを取得する関数
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// ページネーションの開始・終了インデックスを計算する関数
function getPaginationRange(currentPage, totalPages, maxButtons = 5) {
  // 常に奇数のボタン数を表示する（中央に現在のページを表示するため）
  if (maxButtons % 2 === 0) maxButtons++;
  
  const halfButtons = Math.floor(maxButtons / 2);
  
  let startPage = Math.max(currentPage - halfButtons, 1);
  let endPage = Math.min(startPage + maxButtons - 1, totalPages);
  
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(endPage - maxButtons + 1, 1);
  }
  
  return { startPage, endPage };
}

// フォームデータをJSONオブジェクトに変換する関数
function formToObject(formElement) {
  const formData = new FormData(formElement);
  const obj = {};
  
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  
  return obj;
}

// ランダムなID文字列を生成する関数
function generateId(prefix = '', length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

// ローカルストレージにデータを保存する関数
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('ローカルストレージへの保存に失敗しました:', error);
    return false;
  }
}

// ローカルストレージからデータを取得する関数
function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('ローカルストレージからの取得に失敗しました:', error);
    return null;
  }
}

// 要素の表示/非表示を切り替える関数
function toggleElement(element, show) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  
  if (!element) return;
  
  if (show === undefined) {
    element.classList.toggle('hidden');
  } else {
    if (show) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  }
}

// 指定した要素をすべて取得し、各要素に対してコールバック関数を実行する
function forEachElement(selector, callback) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(callback);
}

// ステータス文字列に対応するバッジクラスを返す関数
function getStatusBadgeClass(status) {
  const statusMap = {
    '受注待ち': 'badge-info',
    '受注確定': 'badge-info',
    '出荷準備中': 'badge-warning',
    '出荷済み': 'badge-warning',
    '納品確認待ち': 'badge-warning',
    '納品確認済み': 'badge-success',
    '不一致報告あり': 'badge-danger',
    'キャンセル': 'badge-danger',
    '支払済み': 'badge-success',
    '未払い': 'badge-warning',
    '支払期限超過': 'badge-danger'
  };
  
  return statusMap[status] || 'badge-info';
}

// データをCSVとしてダウンロードする関数
function downloadCSV(data, filename = 'export.csv') {
  if (!data || !data.length) return;
  
  // ヘッダー行を作成
  const headers = Object.keys(data[0]);
  
  // CSV行を作成
  const csvRows = [];
  csvRows.push(headers.join(','));
  
  // データ行を追加
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] || '';
      // カンマを含む場合は引用符で囲む
      return /,/.test(value) ? `"${value}"` : value;
    });
    
    csvRows.push(values.join(','));
  }
  
  // CSVデータを作成
  const csvString = csvRows.join('\n');
  
  // CSVファイルとしてダウンロード
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// デバッグ用：ローカルストレージをモックデータで初期化する関数
function initMockData() {
  // 顧客データ
  const customers = [
    { id: 'C001', name: '株式会社山田商事', contactPerson: '山田一郎', email: 'yamada@example.com', phone: '03-1234-5678', address: '東京都中央区銀座1-1-1' },
    { id: 'C002', name: '有限会社佐藤工業', contactPerson: '佐藤健太', email: 'sato@example.com', phone: '06-2345-6789', address: '大阪府大阪市北区梅田2-2-2' },
    { id: 'C003', name: '株式会社中村電機', contactPerson: '中村洋子', email: 'nakamura@example.com', phone: '092-345-6789', address: '福岡県福岡市博多区博多駅前3-3-3' }
  ];
  
  // 納品先データ
  const deliveryLocations = [
    { id: 'D001', customerId: 'C001', name: '東京本社', address: '東京都中央区銀座1-1-1', contactPerson: '山田一郎', phone: '03-1234-5678', defaultSalesType: '通常' },
    { id: 'D002', customerId: 'C001', name: '横浜支店', address: '神奈川県横浜市西区みなとみらい4-4-4', contactPerson: '山田次郎', phone: '045-234-5678', defaultSalesType: 'マイセラー' },
    { id: 'D003', customerId: 'C002', name: '大阪工場', address: '大阪府大阪市北区梅田2-2-2', contactPerson: '佐藤健太', phone: '06-2345-6789', defaultSalesType: 'マイセラー' },
    { id: 'D004', customerId: 'C003', name: '福岡営業所', address: '福岡県福岡市博多区博多駅前3-3-3', contactPerson: '中村洋子', phone: '092-345-6789', defaultSalesType: '通常' }
  ];
  
  // 商品データ
  const products = [
    { id: 'P001', name: 'シャトー・マルゴー 2018', category: '赤ワイン', price: 85000, stock: 15, region: 'フランス/ボルドー', description: '深いルビー色で、ブラックベリーとスミレの香り。エレガントな味わい。' },
    { id: 'P002', name: 'バローロ・リゼルヴァ 2017', category: '赤ワイン', price: 42000, stock: 8, region: 'イタリア/ピエモンテ', description: 'タンニンが豊富で、チェリーとスパイスの風味。長い余韻が特徴。' },
    { id: 'P003', name: 'プルミエ・クリュ・シャブリ 2019', category: '白ワイン', price: 28000, stock: 22, region: 'フランス/ブルゴーニュ', description: '柑橘類とミネラルの香り。クリスプでエレガントな味わい。' },
    { id: 'P004', name: 'ナパ・ヴァレー・カベルネ 2020', category: '赤ワイン', price: 36000, stock: 18, region: 'アメリカ/カリフォルニア', description: '濃厚な果実味とオークの風味。リッチでパワフルな味わい。' },
    { id: 'P005', name: 'マールボロ・ソーヴィニヨン・ブラン 2021', category: '白ワイン', price: 15000, stock: 30, region: 'ニュージーランド/マールボロ', description: 'グレープフルーツとパッションフルーツの香り。爽やかな酸味。' }
  ];
  
  // 受注データ
  const orders = [
    { 
      id: 'O-2024001', 
      customerId: 'C001', 
      deliveryLocationId: 'D001', 
      orderDate: '2024-04-10', 
      status: '納品確認済み', 
      salesType: '通常', 
      totalAmount: 250000, 
      assignedTo: '田中太郎',
      items: [
        { productId: 'P001', quantity: 2, price: 85000, normalSaleFlag: false },
        { productId: 'P003', quantity: 3, price: 28000, normalSaleFlag: false }
      ]
    },
    { 
      id: 'O-2024002', 
      customerId: 'C002', 
      deliveryLocationId: 'D003', 
      orderDate: '2024-04-15', 
      status: '出荷済み', 
      salesType: 'マイセラー', 
      totalAmount: 120000, 
      assignedTo: '鈴木一郎',
      items: [
        { productId: 'P002', quantity: 2, price: 42000, normalSaleFlag: false },
        { productId: 'P005', quantity: 3, price: 15000, normalSaleFlag: true }
      ]
    },
    { 
      id: 'O-2024003', 
      customerId: 'C003', 
      deliveryLocationId: 'D004', 
      orderDate: '2024-04-20', 
      status: '受注確定', 
      salesType: '通常', 
      totalAmount: 85000, 
      assignedTo: '田中太郎',
      items: [
        { productId: 'P004', quantity: 2, price: 36000, normalSaleFlag: false },
        { productId: 'P005', quantity: 1, price: 15000, normalSaleFlag: false }
      ]
    }
  ];
  
  // 納品データ
  const deliveries = [
    { id: 'DEL-2024001', orderId: 'O-2024001', deliveryDate: '2024-04-12', status: '納品確認済み', confirmedDate: '2024-04-13' },
    { id: 'DEL-2024002', orderId: 'O-2024002', deliveryDate: '2024-04-18', status: '納品確認待ち', confirmedDate: null }
  ];
  
  // マイセラー在庫データ
  const cellarStock = [
    { id: 'CS001', deliveryLocationId: 'D002', productId: 'P001', currentStock: 5, safetyStock: 3, lastReplenishmentDate: '2024-04-05' },
    { id: 'CS002', deliveryLocationId: 'D002', productId: 'P003', currentStock: 2, safetyStock: 2, lastReplenishmentDate: '2024-04-05' },
    { id: 'CS003', deliveryLocationId: 'D003', productId: 'P002', currentStock: 4, safetyStock: 2, lastReplenishmentDate: '2024-04-10' },
    { id: 'CS004', deliveryLocationId: 'D003', productId: 'P005', currentStock: 1, safetyStock: 3, lastReplenishmentDate: '2024-04-10' }
  ];
  
  // 使用実績データ
  const usageRecords = [
    { id: 'U-2024001', deliveryLocationId: 'D002', productId: 'P001', quantity: 2, usageDate: '2024-04-08', registeredBy: '山田次郎', status: '請求済み' },
    { id: 'U-2024002', deliveryLocationId: 'D002', productId: 'P003', quantity: 1, usageDate: '2024-04-10', registeredBy: '山田次郎', status: '未請求' },
    { id: 'U-2024003', deliveryLocationId: 'D003', productId: 'P002', quantity: 1, usageDate: '2024-04-15', registeredBy: '佐藤健太', status: '未請求' }
  ];
  
  // 活動データ
  const activities = [
    { id: 'A-2024001', type: '訪問', customerId: 'C001', deliveryLocationId: 'D002', date: '2024-04-05', status: '完了', subject: 'マイセラー在庫確認', description: '在庫状況を確認。P001が残り少ないため補充を提案。', assignedTo: '田中太郎' },
    { id: 'A-2024002', type: '電話', customerId: 'C002', deliveryLocationId: null, date: '2024-04-12', status: '完了', subject: '新商品案内', description: '新着ワインの案内と試飲会の案内を実施。興味を示されたので資料送付予定。', assignedTo: '鈴木一郎' },
    { id: 'A-2024003', type: 'メール', customerId: 'C003', deliveryLocationId: null, date: '2024-04-18', status: '完了', subject: '受注フォロー', description: 'O-2024003の納期確認のメールを送信。', assignedTo: '田中太郎' },
    { id: 'A-2024004', type: '訪問', customerId: 'C001', deliveryLocationId: 'D001', date: '2024-04-25', status: '予定', subject: '新規提案', description: '夏季キャンペーンの提案訪問。サンプル持参予定。', assignedTo: '田中太郎' }
  ];
  
  // 値引ルールデータ
  const discountRules = [
    { id: 'DR001', name: '大口注文割引', type: '数量割引', condition: '10本以上', discountRate: 5, discountAmount: null, applyTo: '全商品', startDate: '2024-01-01', endDate: '2024-12-31' },
    { id: 'DR002', name: 'VIP顧客割引', type: '顧客割引', condition: 'C001', discountRate: 3, discountAmount: null, applyTo: '全商品', startDate: '2024-01-01', endDate: '2024-12-31' },
    { id: 'DR003', name: '季節限定割引', type: '商品割引', condition: 'P003,P005', discountRate: null, discountAmount: 5000, applyTo: '対象商品のみ', startDate: '2024-04-01', endDate: '2024-05-31' }
  ];
  
  // 請求データ
  const invoices = [
    { id: 'INV-2024001', customerId: 'C001', billingDate: '2024-04-15', dueDate: '2024-05-15', amount: 250000, status: '未払い', items: [{type: '通常', orderId: 'O-2024001', amount: 250000}] },
    { id: 'INV-2024002', customerId: 'C001', billingDate: '2024-04-15', dueDate: '2024-05-15', amount: 170000, status: '支払済み', items: [{type: 'マイセラー', usageId: 'U-2024001', amount: 170000}] }
  ];
  
  // お知らせデータ
  const notices = [
    { id: 'N001', title: '2024年新着ワインのご案内', content: '今年の新着ワインが入荷しました。期間限定でお試しセットをご用意しています。', date: '2024-04-20', target: '全顧客' },
    { id: 'N002', title: 'ゴールデンウィーク休業のお知らせ', content: '2024年5月3日(金)～5月6日(月)は休業とさせていただきます。', date: '2024-04-15', target: '全顧客' },
    { id: 'N003', title: 'マイセラー機能が新しくなりました', content: 'マイセラー在庫管理機能が使いやすくなりました。詳細はこちらからご確認ください。', date: '2024-04-01', target: '全顧客' }
  ];
  
  // データをローカルストレージに保存
  saveToLocalStorage('customers', customers);
  saveToLocalStorage('deliveryLocations', deliveryLocations);
  saveToLocalStorage('products', products);
  saveToLocalStorage('orders', orders);
  saveToLocalStorage('deliveries', deliveries);
  saveToLocalStorage('cellarStock', cellarStock);
  saveToLocalStorage('usageRecords', usageRecords);
  saveToLocalStorage('activities', activities);
  saveToLocalStorage('discountRules', discountRules);
  saveToLocalStorage('invoices', invoices);
  saveToLocalStorage('notices', notices);
  
  console.log('モックデータが初期化されました');
}

// 初期化関数：ページ読み込み時に実行する
function initApp() {
  // ローカルストレージにデータがない場合のみ初期化
  if (!getFromLocalStorage('customers')) {
    initMockData();
  }
  
  // 現在のページに対応する初期化関数を実行
  const currentPage = window.location.pathname.split('/').pop();
  
  switch (currentPage) {
    case 'index.html':
      // ダッシュボードまたは受注一覧
      break;
    case 'order-new.html':
      // 受注登録ページの初期化
      break;
    case 'order-detail.html':
      // 受注詳細ページの初期化
      break;
    // 他のページも同様に
  }
}

// DOMContentLoadedイベントで初期化
document.addEventListener('DOMContentLoaded', initApp);
