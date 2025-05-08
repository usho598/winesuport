/**
 * ワイサポ販売管理システム 受注モデル
 * 受注データの操作に関する関数を定義
 */

class OrderModel {
  /**
   * 全ての受注を取得
   * @returns {Array} 受注データの配列
   */
  static getAll() {
    return getFromLocalStorage('orders') || [];
  }
  
  /**
   * 特定の受注をIDで取得
   * @param {string} id 受注ID
   * @returns {Object|null} 受注データまたはnull
   */
  static getById(id) {
    const orders = this.getAll();
    return orders.find(order => order.id === id) || null;
  }
  
  /**
   * 受注を検索
   * @param {Object} filters 検索フィルター
   * @returns {Array} フィルター条件に一致する受注データの配列
   */
  static search(filters = {}) {
    let orders = this.getAll();
    
    if (filters.customerId) {
      orders = orders.filter(order => order.customerId === filters.customerId);
    }
    
    if (filters.deliveryLocationId) {
      orders = orders.filter(order => order.deliveryLocationId === filters.deliveryLocationId);
    }
    
    if (filters.status) {
      orders = orders.filter(order => order.status === filters.status);
    }
    
    if (filters.salesType) {
      orders = orders.filter(order => order.salesType === filters.salesType);
    }
    
    if (filters.assignedTo) {
      orders = orders.filter(order => order.assignedTo === filters.assignedTo);
    }
    
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      orders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startDate && orderDate <= endDate;
      });
    } else if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      orders = orders.filter(order => new Date(order.orderDate) >= startDate);
    } else if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      orders = orders.filter(order => new Date(order.orderDate) <= endDate);
    }
    
    return orders;
  }
  
  /**
   * 新しい受注を作成
   * @param {Object} orderData 受注データ
   * @returns {Object} 作成された受注データ
   */
  static create(orderData) {
    const orders = this.getAll();
    
    // 新しい受注IDの生成
    const newId = this._generateOrderId();
    
    // 受注データの構築
    const newOrder = {
      id: newId,
      customerId: orderData.customerId,
      deliveryLocationId: orderData.deliveryLocationId,
      orderDate: orderData.orderDate || new Date().toISOString().split('T')[0],
      status: orderData.status || '受注待ち',
      salesType: orderData.salesType || '通常',
      totalAmount: this._calculateTotalAmount(orderData.items),
      assignedTo: orderData.assignedTo,
      items: orderData.items || []
    };
    
    // 受注データの追加
    orders.push(newOrder);
    saveToLocalStorage('orders', orders);
    
    return newOrder;
  }
  
  /**
   * 受注を更新
   * @param {string} id 受注ID
   * @param {Object} updateData 更新データ
   * @returns {Object|null} 更新された受注データまたはnull
   */
  static update(id, updateData) {
    const orders = this.getAll();
    const index = orders.findIndex(order => order.id === id);
    
    if (index === -1) return null;
    
    // 更新データの適用
    const updatedOrder = { ...orders[index], ...updateData };
    
    // 商品項目が更新された場合は合計金額を再計算
    if (updateData.items) {
      updatedOrder.totalAmount = this._calculateTotalAmount(updateData.items);
    }
    
    // 更新データの保存
    orders[index] = updatedOrder;
    saveToLocalStorage('orders', orders);
    
    return updatedOrder;
  }
  
  /**
   * 受注を削除（または受注確定済みの場合はキャンセル）
   * @param {string} id 受注ID
   * @returns {boolean} 削除/キャンセル成功したかどうか
   */
  static delete(id) {
    const orders = this.getAll();
    const order = orders.find(order => order.id === id);
    
    if (!order) return false;
    
    // 受注確定前の場合は削除、確定後はキャンセル処理
    if (order.status === '受注待ち') {
      const filteredOrders = orders.filter(order => order.id !== id);
      saveToLocalStorage('orders', filteredOrders);
    } else {
      order.status = 'キャンセル';
      saveToLocalStorage('orders', orders);
    }
    
    return true;
  }
  
  /**
   * 受注確定処理
   * @param {string} id 受注ID
   * @returns {Object|null} 更新された受注データまたはnull
   */
  static confirmOrder(id) {
    const order = this.getById(id);
    
    if (!order || order.status !== '受注待ち') return null;
    
    return this.update(id, { status: '受注確定' });
  }
  
  /**
   * 顧客の受注履歴を取得
   * @param {string} customerId 顧客ID
   * @returns {Array} 受注履歴データの配列
   */
  static getCustomerOrderHistory(customerId) {
    return this.search({ customerId }).sort((a, b) => 
      new Date(b.orderDate) - new Date(a.orderDate)
    );
  }
  
  /**
   * 納品先の受注履歴を取得
   * @param {string} deliveryLocationId 納品先ID
   * @returns {Array} 受注履歴データの配列
   */
  static getDeliveryLocationOrderHistory(deliveryLocationId) {
    return this.search({ deliveryLocationId }).sort((a, b) => 
      new Date(b.orderDate) - new Date(a.orderDate)
    );
  }
  
  /**
   * 新しい受注IDを生成
   * @returns {string} 生成された受注ID
   * @private
   */
  static _generateOrderId() {
    const orders = this.getAll();
    
    if (orders.length === 0) {
      return 'O-2024001';
    }
    
    // 最後の受注IDから番号を抽出して+1する
    const lastOrder = orders.sort((a, b) => b.id.localeCompare(a.id))[0];
    const lastId = lastOrder.id;
    const lastNumber = parseInt(lastId.split('-')[1], 10);
    const newNumber = lastNumber + 1;
    
    return `O-${newNumber}`;
  }
  
  /**
   * 合計金額を計算
   * @param {Array} items 注文商品リスト
   * @returns {number} 合計金額
   * @private
   */
  static _calculateTotalAmount(items) {
    if (!items || !items.length) return 0;
    
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  
  /**
   * 商品の在庫確認
   * @param {string} productId 商品ID
   * @param {number} quantity 数量
   * @returns {boolean} 在庫が十分にあるかどうか
   */
  static checkStock(productId, quantity) {
    const products = getFromLocalStorage('products') || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) return false;
    
    return product.stock >= quantity;
  }
  
  /**
   * CSVへのエクスポート用データを取得
   * @param {Array} orders 受注データの配列
   * @returns {Array} CSV出力用にフォーマットされたデータ
   */
  static getCSVData(orders) {
    if (!orders) orders = this.getAll();
    
    // 顧客情報の取得
    const customers = getFromLocalStorage('customers') || [];
    const deliveryLocations = getFromLocalStorage('deliveryLocations') || [];
    
    return orders.map(order => {
      // 関連データの取得
      const customer = customers.find(c => c.id === order.customerId) || {};
      const deliveryLocation = deliveryLocations.find(d => d.id === order.deliveryLocationId) || {};
      
      return {
        受注ID: order.id,
        受注日: formatDate(order.orderDate),
        顧客ID: order.customerId,
        顧客名: customer.name || '',
        納品先ID: order.deliveryLocationId,
        納品先名: deliveryLocation.name || '',
        販売区分: order.salesType,
        ステータス: order.status,
        合計金額: order.totalAmount,
        担当者: order.assignedTo,
        商品数: order.items ? order.items.length : 0
      };
    });
  }
}
