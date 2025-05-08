/**
 * ワイサポ販売管理システム 顧客モデル
 * 顧客データの操作に関する関数を定義
 */

class CustomerModel {
  /**
   * 全ての顧客を取得
   * @returns {Array} 顧客データの配列
   */
  static getAll() {
    return getFromLocalStorage('customers') || [];
  }
  
  /**
   * 特定の顧客をIDで取得
   * @param {string} id 顧客ID
   * @returns {Object|null} 顧客データまたはnull
   */
  static getById(id) {
    const customers = this.getAll();
    return customers.find(customer => customer.id === id) || null;
  }
  
  /**
   * 顧客を検索
   * @param {Object} filters 検索フィルター
   * @returns {Array} フィルター条件に一致する顧客データの配列
   */
  static search(filters = {}) {
    let customers = this.getAll();
    
    if (filters.name) {
      const name = filters.name.toLowerCase();
      customers = customers.filter(customer => 
        customer.name.toLowerCase().includes(name)
      );
    }
    
    if (filters.contactPerson) {
      const contactPerson = filters.contactPerson.toLowerCase();
      customers = customers.filter(customer => 
        customer.contactPerson.toLowerCase().includes(contactPerson)
      );
    }
    
    if (filters.address) {
      const address = filters.address.toLowerCase();
      customers = customers.filter(customer => 
        customer.address.toLowerCase().includes(address)
      );
    }
    
    return customers;
  }
  
  /**
   * 新しい顧客を作成
   * @param {Object} customerData 顧客データ
   * @returns {Object} 作成された顧客データ
   */
  static create(customerData) {
    const customers = this.getAll();
    
    // 新しい顧客IDの生成
    const newId = this._generateCustomerId();
    
    // 顧客データの構築
    const newCustomer = {
      id: newId,
      name: customerData.name,
      contactPerson: customerData.contactPerson,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address
    };
    
    // 顧客データの追加
    customers.push(newCustomer);
    saveToLocalStorage('customers', customers);
    
    return newCustomer;
  }
  
  /**
   * 顧客を更新
   * @param {string} id 顧客ID
   * @param {Object} updateData 更新データ
   * @returns {Object|null} 更新された顧客データまたはnull
   */
  static update(id, updateData) {
    const customers = this.getAll();
    const index = customers.findIndex(customer => customer.id === id);
    
    if (index === -1) return null;
    
    // 更新データの適用
    const updatedCustomer = { ...customers[index], ...updateData };
    
    // 更新データの保存
    customers[index] = updatedCustomer;
    saveToLocalStorage('customers', customers);
    
    return updatedCustomer;
  }
  
  /**
   * 顧客の納品先一覧を取得
   * @param {string} customerId 顧客ID
   * @returns {Array} 納品先データの配列
   */
  static getDeliveryLocations(customerId) {
    const deliveryLocations = getFromLocalStorage('deliveryLocations') || [];
    return deliveryLocations.filter(location => location.customerId === customerId);
  }
  
  /**
   * 顧客の取引履歴を取得
   * @param {string} customerId 顧客ID
   * @returns {Object} 取引履歴データ（受注、納品、使用実績）
   */
  static getTransactionHistory(customerId) {
    // 受注履歴
    const orders = OrderModel.getCustomerOrderHistory(customerId);
    
    // 請求履歴
    const invoices = getFromLocalStorage('invoices') || [];
    const customerInvoices = invoices.filter(invoice => invoice.customerId === customerId);
    
    // 活動履歴
    const activities = getFromLocalStorage('activities') || [];
    const customerActivities = activities.filter(activity => activity.customerId === customerId);
    
    return {
      orders,
      invoices: customerInvoices,
      activities: customerActivities
    };
  }
  
  /**
   * 新しい顧客IDを生成
   * @returns {string} 生成された顧客ID
   * @private
   */
  static _generateCustomerId() {
    const customers = this.getAll();
    
    if (customers.length === 0) {
      return 'C001';
    }
    
    // 最後の顧客IDから番号を抽出して+1する
    const lastCustomer = customers.sort((a, b) => b.id.localeCompare(a.id))[0];
    const lastId = lastCustomer.id;
    const lastNumber = parseInt(lastId.substring(1), 10);
    const newNumber = lastNumber + 1;
    
    return `C${newNumber.toString().padStart(3, '0')}`;
  }
}

/**
 * ワイサポ販売管理システム 納品先モデル
 * 納品先データの操作に関する関数を定義
 */
class DeliveryLocationModel {
  /**
   * 全ての納品先を取得
   * @returns {Array} 納品先データの配列
   */
  static getAll() {
    return getFromLocalStorage('deliveryLocations') || [];
  }
  
  /**
   * 特定の納品先をIDで取得
   * @param {string} id 納品先ID
   * @returns {Object|null} 納品先データまたはnull
   */
  static getById(id) {
    const locations = this.getAll();
    return locations.find(location => location.id === id) || null;
  }
  
  /**
   * 納品先を検索
   * @param {Object} filters 検索フィルター
   * @returns {Array} フィルター条件に一致する納品先データの配列
   */
  static search(filters = {}) {
    let locations = this.getAll();
    
    if (filters.customerId) {
      locations = locations.filter(location => location.customerId === filters.customerId);
    }
    
    if (filters.name) {
      const name = filters.name.toLowerCase();
      locations = locations.filter(location => 
        location.name.toLowerCase().includes(name)
      );
    }
    
    if (filters.address) {
      const address = filters.address.toLowerCase();
      locations = locations.filter(location => 
        location.address.toLowerCase().includes(address)
      );
    }
    
    if (filters.defaultSalesType) {
      locations = locations.filter(location => 
        location.defaultSalesType === filters.defaultSalesType
      );
    }
    
    return locations;
  }
  
  /**
   * 新しい納品先を作成
   * @param {Object} locationData 納品先データ
   * @returns {Object} 作成された納品先データ
   */
  static create(locationData) {
    const locations = this.getAll();
    
    // 新しい納品先IDの生成
    const newId = this._generateLocationId();
    
    // 納品先データの構築
    const newLocation = {
      id: newId,
      customerId: locationData.customerId,
      name: locationData.name,
      address: locationData.address,
      contactPerson: locationData.contactPerson,
      phone: locationData.phone,
      defaultSalesType: locationData.defaultSalesType || '通常'
    };
    
    // 納品先データの追加
    locations.push(newLocation);
    saveToLocalStorage('deliveryLocations', locations);
    
    return newLocation;
  }
  
  /**
   * 納品先を更新
   * @param {string} id 納品先ID
   * @param {Object} updateData 更新データ
   * @returns {Object|null} 更新された納品先データまたはnull
   */
  static update(id, updateData) {
    const locations = this.getAll();
    const index = locations.findIndex(location => location.id === id);
    
    if (index === -1) return null;
    
    // 更新データの適用
    const updatedLocation = { ...locations[index], ...updateData };
    
    // 更新データの保存
    locations[index] = updatedLocation;
    saveToLocalStorage('deliveryLocations', locations);
    
    return updatedLocation;
  }
  
  /**
   * 納品先を削除
   * @param {string} id 納品先ID
   * @returns {boolean} 削除成功したかどうか
   */
  static delete(id) {
    const locations = this.getAll();
    
    // この納品先を参照している受注がないか確認
    const orders = getFromLocalStorage('orders') || [];
    const hasOrders = orders.some(order => order.deliveryLocationId === id);
    
    if (hasOrders) {
      return false; // 関連する受注があるため削除できない
    }
    
    const filteredLocations = locations.filter(location => location.id !== id);
    saveToLocalStorage('deliveryLocations', filteredLocations);
    
    return true;
  }
  
  /**
   * 納品先の取引履歴を取得
   * @param {string} locationId 納品先ID
   * @returns {Object} 取引履歴データ（受注、使用実績）
   */
  static getTransactionHistory(locationId) {
    // 受注履歴
    const orders = OrderModel.getDeliveryLocationOrderHistory(locationId);
    
    // 使用実績履歴
    const usageRecords = getFromLocalStorage('usageRecords') || [];
    const locationUsageRecords = usageRecords.filter(record => 
      record.deliveryLocationId === locationId
    );
    
    // 活動履歴
    const activities = getFromLocalStorage('activities') || [];
    const locationActivities = activities.filter(activity => 
      activity.deliveryLocationId === locationId
    );
    
    return {
      orders,
      usageRecords: locationUsageRecords,
      activities: locationActivities
    };
  }
  
  /**
   * 納品先のマイセラー在庫を取得
   * @param {string} locationId 納品先ID
   * @returns {Array} マイセラー在庫データの配列
   */
  static getCellarStock(locationId) {
    const cellarStock = getFromLocalStorage('cellarStock') || [];
    return cellarStock.filter(stock => stock.deliveryLocationId === locationId);
  }
  
  /**
   * 新しい納品先IDを生成
   * @returns {string} 生成された納品先ID
   * @private
   */
  static _generateLocationId() {
    const locations = this.getAll();
    
    if (locations.length === 0) {
      return 'D001';
    }
    
    // 最後の納品先IDから番号を抽出して+1する
    const lastLocation = locations.sort((a, b) => b.id.localeCompare(a.id))[0];
    const lastId = lastLocation.id;
    const lastNumber = parseInt(lastId.substring(1), 10);
    const newNumber = lastNumber + 1;
    
    return `D${newNumber.toString().padStart(3, '0')}`;
  }
}
