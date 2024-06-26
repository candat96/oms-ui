// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Home',
    href: 'home',
    icon: 'ri-home-smile-line'
  },
  {
    label: 'Nhập: Kiểm',
    icon: 'ri-ancient-gate-line',
    href: 'input-check',
    children: [
      { label: 'Thường', href: 'normal' },
      { label: 'Nhanh', href: 'flat' },
      { label: 'SP. Dán UID', href: 'paste-uid' }
    ]
  },
  // {
  //   label: 'Nhập: Biên bản',
  //   icon: 'ri-article-line',
  //   href: 'input-report'
  // },
  {
    label: 'Nhập: Lên kệ',
    href: 'input-shelf',
    icon: 'ri-archive-line'
  },
  {
    label: 'Pickup',
    href: 'to-pickup',
    icon: 'ri-guide-line'
  },
  // {
  //   label: 'Đóng gói',
  //   href: 'to-pack',
  //   icon: 'ri-store-line'
  // },
  // {
  //   label: 'Bàn giao',
  //   href: 'hand-over',
  //   icon: 'ri-shake-hands-line'
  // },
  {
    label: 'Hàng hoàn',
    href: 'to-return',
    icon: 'ri-creative-commons-sa-line',
    children: [
      {
        label: 'Example',
        href: 'example',
        icon: 'ri-exchange-box-line'
      }
    ]
  },
  // {
  //   label: 'Vị trí',
  //   href: 'to-location',
  //   icon: 'ri-map-pin-line',
  //   children: [
  //     {
  //       label: 'Example',
  //       href: 'example',
  //       icon: 'ri-exchange-box-line'
  //     }
  //   ]
  // },
  {
    label: 'Quản lý',
    isSection: true,
    children: [
      {
        label: 'QL. Hàng',
        href: 'manage/goods',
        icon: 'ri-align-item-left-line'
      },
      {
        label: 'QL. UID',
        href: 'manage/uids',
        icon: 'ri-baidu-line'
      },
      {
        label: 'QL. Nhập',
        href: 'manage/input',
        icon: 'ri-import-line'
      },
      {
        label: 'QL. Xuất',
        href: 'manage/export',
        icon: 'ri-export-line'
      },
      {
        label: 'QL. Vật Tư',
        href: 'manage/supply',
        icon: 'ri-suitcase-2-line'
      }
    ]
  },

  // {
  //   label: 'QL. Pickup',
  //   href: 'manage/pickup',
  //   icon: 'ri-hospital-line'
  // },
  // {
  //   label: 'QL. Hoàn',
  //   href: 'manage/return',
  //   icon: 'ri-arrow-left-circle-line'
  // },
  // {
  //   label: 'QL. Nhân viên',
  //   href: 'manage/staff',
  //   icon: 'ri-user-4-line'
  // },
  // {
  //   label: 'Yêu cầu xử lý',
  //   href: 'to-request',
  //   icon: 'ri-git-pull-request-line'
  // },
  // {
  //   label: 'Yêu cầu tìm hàng',
  //   href: 'good-request',
  //   icon: 'ri-menu-search-line'
  // },

  // {
  //   label: 'About',
  //   href: 'about',
  //   icon: 'ri-information-line'
  // }

  {
    label: 'Danh mục',
    isSection: true,
    children: [
      {
        label: 'DM. Kho',
        href: 'category/warehouse',
        icon: 'ri-archive-stack-line'
      },
      {
        label: 'DM. Layout',
        href: 'category/layout',
        icon: 'ri-layout-grid-line'
      },
      {
        label: 'DM. Chủ hàng',
        href: 'category/boss',
        icon: 'ri-account-box-line'
      },
      {
        label: 'DM. Sản phẩm',
        href: 'category/product',
        icon: 'ri-align-item-bottom-line'
      },
      {
        label: 'DM. Đơn vị',
        href: 'category/unit',
        icon: 'ri-community-line'
      },
      {
        label: 'DM. Vật tư',
        href: 'category/supply',
        icon: 'ri-suitcase-line'
      },
      {
        label: 'DM. Sọt',
        href: 'category/basket',
        icon: 'ri-shopping-basket-line'
      }
    ]
  }
]

export default verticalMenuData
