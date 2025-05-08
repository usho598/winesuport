/**
 * ワイサポ販売管理システム レイアウト管理
 * 共通のレイアウト要素を管理するスクリプト
 */

// サイドナビゲーションの現在のページをアクティブにする
function setActiveNavItem() {
  // 現在のパスからファイル名を取得
  const currentPath = window.location.pathname;
  const fileName = currentPath.split('/').pop();
  
  // すべてのナビゲーションリンクを取得
  const navLinks = document.querySelectorAll('.side-nav a');
  
  // 各リンクのhref属性とページ名を比較
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    
    // リンクのhrefがファイル名と一致する場合、activeクラスを追加
    if (linkHref === fileName) {
      link.classList.add('bg-red-900');
      link.classList.add('active');
    } else {
      link.classList.remove('bg-red-900');
      link.classList.remove('active');
    }
  });
}

// ページ全体の一貫性を確保するためのセットアップ
function setupLayout() {
  // サイドナビゲーションの設定
  setActiveNavItem();
  
  // ヘッダーのページタイトル設定（data-page-title属性から取得）
  const pageTitle = document.querySelector('meta[data-page-title]');
  const headerTitleElement = document.querySelector('.header-title');
  
  if (pageTitle && headerTitleElement) {
    headerTitleElement.textContent = pageTitle.getAttribute('data-page-title');
  }
  
  // モバイル用のナビゲーションボタン設定
  const mobileNavButton = document.querySelector('.mobile-nav-button');
  const sideNav = document.querySelector('.side-nav');
  
  if (mobileNavButton && sideNav) {
    mobileNavButton.addEventListener('click', () => {
      sideNav.classList.toggle('mobile-nav-open');
    });
  }
}

// ドキュメントの読み込みが完了したらレイアウトをセットアップ
document.addEventListener('DOMContentLoaded', setupLayout);
