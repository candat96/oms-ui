// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

type IProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  locale: string | string[]
}

const useVerticalMenuData = (props: IProps): VerticalMenuDataType[] => {
  const { dictionary, locale } = props

  return [
    {
      label: dictionary['navigation'].home,
      href: `${locale}/home`,
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
      label: dictionary['navigation'].manage.manage,
      isSection: true,
      children: [
        {
          label: dictionary['navigation'].manage.manageGoods,
          href: `${locale}/manage/goods`,
          icon: 'ri-align-item-left-line'
        },
        {
          label: dictionary['navigation'].manage.manageUid,
          href: `${locale}/manage/uids`,
          icon: 'ri-baidu-line'
        },
        {
          label: dictionary['navigation'].manage.manageImp,
          href: `${locale}/manage/input`,
          icon: 'ri-import-line'
        },
        {
          label: dictionary['navigation'].manage.manageExp,
          href: `${locale}/manage/export`,
          icon: 'ri-export-line'
        },
        {
          label: dictionary['navigation'].manage.manageMate,
          href: `${locale}/manage/supply`,
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
      label: dictionary['navigation'].category.category,
      isSection: true,
      children: [
        // {
        //   label: dictionary['navigation'].category.inventoryShort,
        //   href: `${locale}/category/warehouse`,
        //   icon: 'ri-archive-stack-line'
        // },
        // {
        //   label: 'DM. Layout',
        //   href: 'category/layout',
        //   icon: 'ri-layout-grid-line'
        // },
        // {
        //   label: dictionary['navigation'].category.shipmentShort,
        //   href: `${locale}/category/boss`,
        //   icon: 'ri-account-box-line'
        // },
        {
          label: dictionary['navigation'].category.productShort,
          href: `${locale}/category/product`,
          icon: 'ri-align-item-bottom-line'
        },
        {
          label: dictionary['navigation'].category.unitsShort,
          href: `${locale}/category/unit`,
          icon: 'ri-community-line'
        },
        {
          label: dictionary['navigation'].category.materialsShort,
          href: `${locale}/category/supply`,
          icon: 'ri-suitcase-line'
        },
        {
          label: dictionary['navigation'].category.materialTypeList,
          href: `${locale}/category/type-supply`,
          icon: 'ri-suitcase-line'
        },

        {
          label: dictionary['navigation'].category.supplierDirectoryShort,
          href: `${locale}/category/provider`,
          icon: 'ri-community-line'
        }
        // {
        //   label: 'DM. Sọt',
        //   href: 'category/basket',
        //   icon: 'ri-shopping-basket-line'
        // }
      ]
    }
  ]
}

export default useVerticalMenuData
